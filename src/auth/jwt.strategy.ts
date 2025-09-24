import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';

export interface JwtPayload {
  sub: string;
  role?: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET environment variable is not set');
    }

    const options: StrategyOptions = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken as () => string,
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    };

    super(options);
  }

  validate(payload: JwtPayload) {
    return {
      userId: payload.sub,
      role: payload.role ?? 'AUTHENTICATED',
    };
  }
}
