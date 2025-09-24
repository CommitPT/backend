import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma, users } from '@prisma/client';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  public async getUserByEmail(email: users['email']) {
    return this.prisma.users.findUnique({
      where: { email },
    });
  }

  public async createUser(data: Prisma.usersCreateInput) {
    return this.prisma.users.create({
      data,
      include: { user_roles: { include: { role: true } } },
    });
  }
}
