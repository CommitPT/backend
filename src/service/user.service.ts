import { SignInDto, SignUpDto } from '@/dto';
import { UserResponseDto } from '@/dto/user-response.dto';
import { UserRepository } from '@/repository/user.repository';
import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { v4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  public async signIn(dto: SignInDto) {
    const userData = await this.userRepository.getUserByEmail(dto.email);

    if (!userData) throw new UnauthorizedException();

    const isPasswordValid = await bcrypt.compare(dto.password, userData.password);

    if (!isPasswordValid) throw new UnauthorizedException();

    return new UserResponseDto(userData);
  }

  public async signUp(dto: SignUpDto) {
    const userByEmail = await this.userRepository.getUserByEmail(dto.email);
    if (userByEmail) throw new ConflictException('User already exists');

    const encryptedPassword = await bcrypt.hash(dto.password, 10);

    const userData = await this.userRepository.createUser({
      uuid: v4(),
      email: dto.email,
      password: encryptedPassword,
      username: dto.username,
    });

    return new UserResponseDto(userData);
  }
}
