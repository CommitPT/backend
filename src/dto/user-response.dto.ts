import { users } from '@prisma/client';

export class UserResponseDto {
  uuid: users['uuid'];
  email: users['email'];
  username: users['username'];
  created_at: users['created_at'];
  updated_at: users['updated_at'];
  accessToken: string;
  refreshToken: string;

  constructor(user: users, accessToken: string, refreshToken: string) {
    this.uuid = user.uuid;
    this.email = user.email;
    this.username = user.username;
    this.created_at = user.created_at;
    this.updated_at = user.updated_at;
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }
}
