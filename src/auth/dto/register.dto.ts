import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UserPreferenceDto } from '../../users/dto/user-preference.dto';

export class RegisterDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  push_token?: string;

  @ValidateNested()
  @Type(() => UserPreferenceDto)
  preferences: UserPreferenceDto;
}
