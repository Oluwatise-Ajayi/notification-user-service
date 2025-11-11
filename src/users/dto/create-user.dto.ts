import { IsEmail, IsString, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UserPreferenceDto } from './user-preference.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'Ada Lovelace' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'ada@example.com' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ example: 'device-token-123' })
  @IsOptional()
  @IsString()
  push_token?: string;

  @ApiProperty({ type: () => UserPreferenceDto })
  @ValidateNested()
  @Type(() => UserPreferenceDto)
  preferences: UserPreferenceDto;
}
