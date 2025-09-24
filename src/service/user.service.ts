import { RefreshTokenDto, SignInDto, SignUpDto } from '@/dto';
import { UserResponseDto } from '@/dto/user-response.dto';
import { RolesRepository } from '@/repository/roles.repository';
import { TokenRepository } from '@/repository/token.repository';
import { UserRepository } from '@/repository/user.repository';
import { ConflictException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { v4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly rolesRepository: RolesRepository,
    private readonly tokenRepository: TokenRepository,
  ) {}

  public async signIn(dto: SignInDto) {
    const userData = await this.userRepository.getUserByEmail(dto.email);

    if (!userData) throw new UnauthorizedException();

    const isPasswordValid = await bcrypt.compare(dto.password, userData.password);

    if (!isPasswordValid) throw new UnauthorizedException();

    const userRole = userData.user_roles[0].role.name; // Check later how to handle this better

    const { accessToken, refreshToken } = this.generateTokens(userData.uuid, userRole);

    const accessTokenExpiry = new Date(Date.now() + 1 * 60 * 1000); // 1m (Test value)
    const refreshTokenExpiry = new Date(Date.now() + 5 * 60 * 60 * 1000); // 5m (Test value)

    await Promise.all([
      this.tokenRepository.createAccessToken({
        user: { connect: { id: userData.id } },
        token: accessToken,
        expires_at: accessTokenExpiry,
      }),
      this.tokenRepository.createRefreshToken({
        user: { connect: { id: userData.id } },
        token: refreshToken,
        expires_at: refreshTokenExpiry,
      }),
    ]);

    return new UserResponseDto(userData, accessToken, refreshToken);
  }

  public async signUp(dto: SignUpDto) {
    const userByEmail = await this.userRepository.getUserByEmail(dto.email);
    if (userByEmail) throw new ConflictException('User already exists');

    const encryptedPassword = await bcrypt.hash(dto.password, 10);

    const role = await this.rolesRepository.getRoleByName(dto.role);

    if (dto.role != 'MEMBER' || !role) throw new UnauthorizedException('Role not available');

    const userData = await this.userRepository.createUser({
      uuid: v4(),
      email: dto.email,
      password: encryptedPassword,
      username: dto.username,
      user_roles: {
        create: [
          {
            role: {
              connect: { id: role.id },
            },
          },
        ],
      },
    });

    const { accessToken, refreshToken } = this.generateTokens(userData.uuid, role.name);

    const accessTokenExpiry = new Date(Date.now() + 1 * 60 * 1000); // 1m (Test value)
    const refreshTokenExpiry = new Date(Date.now() + 5 * 60 * 60 * 1000); // 5m (Test value)

    await Promise.all([
      this.tokenRepository.createAccessToken({
        user: { connect: { id: userData.id } },
        token: accessToken,
        expires_at: accessTokenExpiry,
      }),
      this.tokenRepository.createRefreshToken({
        user: { connect: { id: userData.id } },
        token: refreshToken,
        expires_at: refreshTokenExpiry,
      }),
    ]);

    return new UserResponseDto(userData, accessToken, refreshToken);
  }

  public async refreshTokens(dto: RefreshTokenDto) {
    try {
      const oldToken = dto.refreshToken;

      this.jwtService.verify(oldToken);

      const storedRefreshToken = await this.tokenRepository.getRefreshToken(oldToken);

      if (!storedRefreshToken || storedRefreshToken.expires_at < new Date()) {
        throw new UnauthorizedException('Invalid or expired refresh token');
      }

      const userData = await this.userRepository.getUserById(storedRefreshToken.user_id);

      if (!userData) throw new UnauthorizedException('User not found');

      const userRole = userData.user_roles[0].role.name;

      const { accessToken, refreshToken: newRefreshToken } = this.generateTokens(userData.uuid, userRole);

      const accessTokenExpiry = new Date(Date.now() + 1 * 60 * 1000); // 1m (Test value)
      const refreshTokenExpiry = new Date(Date.now() + 5 * 60 * 60 * 1000); // 5m (Test value)

      await this.tokenRepository.updateRefreshToken({
        ...storedRefreshToken,
        created_at: new Date(),
      });

      await Promise.all([
        this.tokenRepository.createAccessToken({
          user: { connect: { id: userData.id } },
          token: accessToken,
          expires_at: accessTokenExpiry,
        }),
        this.tokenRepository.createRefreshToken({
          user: { connect: { id: userData.id } },
          token: newRefreshToken,
          expires_at: refreshTokenExpiry,
        }),
      ]);

      return new RefreshTokenDto(newRefreshToken);
    } catch (e) {
      Logger.error(e);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  public async logOut(accessToken: string) {
    const storedToken = await this.tokenRepository.getAccessToken(accessToken);

    if (storedToken) {
      await this.tokenRepository.updateAccessToken({
        // Revoke current token
        ...storedToken,
        revoked_at: new Date(),
      });

      await this.tokenRepository.revokeRefreshToken(storedToken); // Revoke any existing access tokens for this user
    }

    return { message: 'Successfully logged out' };
  }

  generateAccessToken(userId: string, role: string) {
    return this.jwtService.sign({ sub: userId, role }, { expiresIn: '1m' });
  }

  generateRefreshToken(userId: string, role: string) {
    return this.jwtService.sign({ sub: userId, role }, { expiresIn: '5m' });
  }

  generateTokens(userId: string, role: string) {
    const accessToken = this.generateAccessToken(userId, role);
    const refreshToken = this.generateRefreshToken(userId, role);

    return { accessToken, refreshToken };
  }
}
