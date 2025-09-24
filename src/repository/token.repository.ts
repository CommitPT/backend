import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { access_tokens, Prisma, refresh_tokens } from '@prisma/client';

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

  public async updateAccessToken(token_id: access_tokens['id']) {
    return this.prisma.access_tokens.update({
      where: { id: token_id },
      data: { revoked_at: new Date() },
    });
  }

  public async updateRefreshToken(token_id: refresh_tokens['id']) {
    return this.prisma.refresh_tokens.update({
      where: { id: token_id },
      data: { revoked_at: new Date() },
    });
  }
}
