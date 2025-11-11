import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
  Patch,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { UserPreferenceDto } from './dto/user-preference.dto';
import { UserResponseDto } from './dto/user-response.dto';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return {
      success: true,
      data: user,
      error: null,
      message: 'User created successfully',
      meta: null,
    };
  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    return await this.usersService.findAll(paginationDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    return {
      success: true,
      data: user,
      message: 'User retrieved successfully',
    };
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.usersService.update(id, updateUserDto);
    return {
      success: true,
      data: user,
      message: 'User updated successfully',
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    await this.usersService.remove(id);
    return {
      success: true,
      message: 'User deleted successfully',
    };
  }
  @Patch(':id/preferences')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update user notification preferences' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiOkResponse({ type: UserResponseDto })
  async updatePreferences(
    @Param('id') id: string,
    @Body() preferencesDto: UserPreferenceDto,
  ) {
    const user = await this.usersService.updatePreferences(id, preferencesDto);
    return {
      success: true,
      data: user,
      message: 'User preferences updated successfully',
    };
  }
}
