import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RolesRepository {
  constructor(private readonly prisma: PrismaService) {}

  public async getRoleByName(roleName: string) {
    return this.prisma.roles.findUnique({
      where: { name: roleName },
    });
  }
}
