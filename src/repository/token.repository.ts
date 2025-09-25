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

  public async updateAccessToken(token: access_tokens) {
    return this.prisma.access_tokens.update({
      where: { id: token.id },
      data: token,
    });
  }

  public async updateRefreshToken(token: refresh_tokens) {
    return this.prisma.refresh_tokens.update({
      where: { id: token.id },
      data: token,
    });
  }

  public async revokeRefreshToken(user_id: number) {
    return this.prisma.refresh_tokens.updateMany({
      where: {
        user_id: user_id,
        revoked_at: null,
      },
      data: { revoked_at: new Date() },
    });
  }
}
