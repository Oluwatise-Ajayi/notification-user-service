import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginatedResponse } from '../common/interfaces/paginated-response.interface';
import { createPaginationMeta } from '../common/utils/pagination.utils';
import { UserPreferenceDto } from './dto/user-preference.dto';
import { LoggingService } from '../common/services/logging.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly loggingService: LoggingService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create(createUserDto);
    return await this.usersRepository.save(user);
  }

  async findAll(
    paginationDto: PaginationDto,
  ): Promise<PaginatedResponse<User>> {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [users, total] = await this.usersRepository.findAndCount({
      skip,
      take: limit,
      order: { created_at: 'DESC' },
    });

    const meta = createPaginationMeta(total, page, limit);

    return {
      success: true,
      data: users,
      message: 'Users retrieved successfully',
      meta,
    };
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    Object.assign(user, updateUserDto);
    return await this.usersRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
  async updatePreferences(
    userId: string,
    preferencesDto: UserPreferenceDto,
  ): Promise<User> {
    const user = await this.findOne(userId);

    // Store previous preferences for logging
    const previousPreferences = { ...user.preferences };

    // Update preferences
    user.preferences = preferencesDto;
    const updatedUser = await this.usersRepository.save(user);

    // Log preference update
    this.loggingService.logWithCorrelation('user_preferences_updated', {
      event: 'preference_update',
      user_id: userId,
      status_change: {
        from: previousPreferences,
        to: preferencesDto,
      },
    });

    return updatedUser;
  }
}
