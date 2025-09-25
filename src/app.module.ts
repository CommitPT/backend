import { PrismaModule } from '@/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { JwtStrategy } from './auth/jwt.strategy';
import { RolesGuard } from './auth/roles.guard';
import { AuthController } from './controller/auth/index.controller';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { RolesRepository } from './repository/roles.repository';
import { TokenRepository } from './repository/token.repository';
import { UserRepository } from './repository/user.repository';
import { AuthService } from './service/user.service';

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
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
  exports: [JwtStrategy, RolesGuard],
})
export class AppModule {}
