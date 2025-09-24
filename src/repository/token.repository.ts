import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class TokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  public async createAccessToken(data: Prisma.access_tokensCreateInput) {
    return this.prisma.access_tokens.create({ data });
  }

  public async createRefreshToken(data: Prisma.refresh_tokensCreateInput) {
    return this.prisma.refresh_tokens.create({ data });
  }

  public async getAccessToken(token: string) {
    return this.prisma.access_tokens.findUnique({
      where: { token },
    });
  }

  public async getRefreshToken(token: string) {
    return this.prisma.refresh_tokens.findUnique({
      where: { token },
    });
  }
}
