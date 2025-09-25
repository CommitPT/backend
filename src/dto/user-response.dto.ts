import { ApiProperty } from '@nestjs/swagger';
import { users } from '@prisma/client';

export class UserResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  uuid: users['uuid'];

  @ApiProperty({ example: 'user@example.com' })
  email: users['email'];

  @ApiProperty({ example: 'username' })
  username: users['username'];

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  created_at: users['created_at'];

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  updated_at: users['updated_at'];

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  accessToken: string;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
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
