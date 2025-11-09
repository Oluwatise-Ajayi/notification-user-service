import { IsEmail, IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  device_token?: string;

  @IsOptional()
  @IsBoolean()
  push_enabled?: boolean;

  @IsOptional()
  @IsBoolean()
  email_enabled?: boolean;

  @IsOptional()
  @IsBoolean()
  sms_enabled?: boolean;
}
