import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserPreferenceDto } from './user-preference.dto';

export class UserResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: 'ada@example.com' })
  email: string;

  @ApiProperty({ example: 'Ada Lovelace' })
  name: string;

  @ApiPropertyOptional({ example: 'device-token-123' })
  push_token?: string;

  @ApiProperty({ type: () => UserPreferenceDto })
  preferences: UserPreferenceDto;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  created_at: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  updated_at: Date;
}
