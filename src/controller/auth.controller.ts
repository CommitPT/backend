import { RolesGuard } from '@/auth/roles.guard';
import { RefreshTokenDto, SignInDto, SignUpDto, LogOutDto } from '@/dto';
import { AuthService } from '@/service/user.service';
import { Body, Controller, HttpException, Logger, Post, Res, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Throttle } from '@nestjs/throttler';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-in')
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  async signIn(@Body(ValidationPipe) body: SignInDto, @Res() res: Response) {
    try {
      const user = await this.authService.signIn(body);
      return res.status(200).json(user);
    } catch (e) {
      Logger.error(e);
      if (e instanceof HttpException) {
        return res.status(e.getStatus()).json(e.getResponse());
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  @Post('/sign-up')
  async signUp(@Body(ValidationPipe) body: SignUpDto, @Res() res: Response) {
    try {
      const user = await this.authService.signUp(body);
      return res.status(201).json(user);
    } catch (e) {
      Logger.error(e);
      if (e instanceof HttpException) {
        return res.status(e.getStatus()).json(e.getResponse());
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  @Post('/refresh')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async refresh(@Body(ValidationPipe) body: RefreshTokenDto, @Res() res: Response) {
    try {
      const refreshToken = await this.authService.refreshTokens(body);
      return res.status(201).json(refreshToken);
    } catch (e) {
      Logger.error(e);
      if (e instanceof HttpException) {
        return res.status(e.getStatus()).json(e.getResponse());
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  @Post('/logout')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async logOut(@Body(ValidationPipe) body: LogOutDto, @Res() res: Response) {
    try {
      const logOutMessage = await this.authService.logOut(body);
      return res.status(201).json(logOutMessage);
    } catch (e) {
      Logger.error(e);
      if (e instanceof HttpException) {
        return res.status(e.getStatus()).json(e.getResponse());
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}
