import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignUpDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  fullName: string;
}
