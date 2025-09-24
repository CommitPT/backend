import { PrismaModule } from '@/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import { UserRepository } from './repository/user.repository';
import { AuthService } from './service/user.service';
import { JwtModule } from '@nestjs/jwt';
import { RolesRepository } from './repository/roles.repository';
import { TokenRepository } from './repository/token.repository';

const repositories = [UserRepository, RolesRepository, TokenRepository];
const services = [AuthService];

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1m' },
    }),
  ],
  controllers: [AuthController],
  providers: [...services, ...repositories],
})
export class AppModule {}
