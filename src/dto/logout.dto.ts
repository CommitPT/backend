import { IsNotEmpty, IsString } from 'class-validator';

export class LogOutDto {
  @IsString()
  @IsNotEmpty()
  accessToken: string;
}
