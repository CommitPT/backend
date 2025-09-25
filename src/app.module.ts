import { PrismaModule } from '@/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import { UserRepository } from './repository/user.repository';
import { AuthService } from './service/user.service';
import { JwtModule } from '@nestjs/jwt';
import { RolesRepository } from './repository/roles.repository';
import { TokenRepository } from './repository/token.repository';
import { JwtStrategy } from './auth/jwt.strategy';
import { RolesGuard } from './auth/roles.guard';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

const repositories = [UserRepository, RolesRepository, TokenRepository];
const services = [AuthService];

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '5m' },
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 10,
        },
      ],
    }),
  ],
  controllers: [AuthController],
  providers: [
    ...services,
    ...repositories,
    JwtStrategy,
    RolesGuard,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  exports: [JwtStrategy, RolesGuard],
})
export class AppModule {}
