import { PrismaModule } from '@/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import { UserRepository } from './repository/user.repository';
import { AuthService } from './service/user.service';

const repositories = [UserRepository];
const services = [AuthService];

@Module({
  imports: [PrismaModule],
  controllers: [AuthController],
  providers: [...services, ...repositories],
})
export class AppModule {}
