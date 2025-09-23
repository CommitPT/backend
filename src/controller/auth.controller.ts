import { SignInDto, SignUpDto } from '@/dto';
import { AuthService } from '@/service/user.service';
import { Body, Controller, HttpException, Logger, Post, Res, ValidationPipe } from '@nestjs/common';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-in')
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
}
