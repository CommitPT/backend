import { RolesGuard } from '@/auth/roles.guard';
import { THROTTLE_DEFAULT } from '@/config/constants';
import { RefreshTokenDto, SignInDto, SignUpDto } from '@/dto';
import { AuthService } from '@/service/user.service';
import { Body, Controller, Headers, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { SwaggerLogOutDocs, SwaggerRefreshDocs, SwaggerSignInDocs, SwaggerSignUpDocs } from './decorators';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-in')
  @ApiOperation({
    summary: 'User sign in',
    description: 'Authenticate user with email and password to receive access and refresh tokens',
  })
  @SwaggerSignInDocs()
  @Throttle({ default: THROTTLE_DEFAULT })
  async signIn(@Body(ValidationPipe) body: SignInDto) {
    return await this.authService.signIn(body);
  }

  @Post('/sign-up')
  @ApiOperation({
    summary: 'User sign up',
    description: 'Create a new user account with email, password, and username',
  })
  @SwaggerSignUpDocs()
  @Throttle({ default: THROTTLE_DEFAULT })
  async signUp(@Body(ValidationPipe) body: SignUpDto) {
    return await this.authService.signUp(body);
  }

  @Post('/refresh')
  @ApiOperation({
    summary: 'Refresh tokens',
    description: 'Generate new access and refresh tokens using a valid refresh token',
  })
  @SwaggerRefreshDocs()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async refresh(@Body(ValidationPipe) body: RefreshTokenDto) {
    return await this.authService.refreshTokens(body);
  }

  @Post('/logout')
  @ApiOperation({
    summary: 'User logout',
    description: 'Invalidate the current access token and log out the user',
  })
  @SwaggerLogOutDocs()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async logOut(@Headers('Authorization') authHeader: string) {
    const token = authHeader?.replace('Bearer ', '');
    await this.authService.logOut(token);
    return null;
  }
}
