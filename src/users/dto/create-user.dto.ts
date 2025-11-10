import { IsEmail, IsString, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UserPreferenceDto } from './user-preference.dto';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  push_token?: string;

  @ValidateNested()
  @Type(() => UserPreferenceDto)
  preferences: UserPreferenceDto;
}
