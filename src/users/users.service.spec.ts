import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoggingService } from '../common/services/logging.service';
import { ClsService } from 'nestjs-cls';

describe('UsersService', () => {
  let service: UsersService;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    findAndCount: jest.fn(),
    delete: jest.fn(),
  };

  const mockLoggingService = {
    logWithCorrelation: jest.fn(),
  };

  const mockClsService = {
    get: jest.fn().mockReturnValue('test-correlation-id'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
        {
          provide: LoggingService,
          useValue: mockLoggingService,
        },
        {
          provide: ClsService,
          useValue: mockClsService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createUserDto: CreateUserDto = {
        name: 'Test User',
        email: 'test@example.com',
        preferences: { email: true, push: true },
      };

      const expectedUser = {
        id: '123',
        ...createUserDto,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockRepository.create.mockReturnValue(expectedUser);
      mockRepository.save.mockResolvedValue(expectedUser);

      const result = await service.create(createUserDto);

      expect(result).toEqual(expectedUser);
      expect(mockRepository.create).toHaveBeenCalledWith(createUserDto);
      expect(mockRepository.save).toHaveBeenCalledWith(expectedUser);
    });
  });

  describe('updatePreferences', () => {
    it('should update user preferences', async () => {
      const userId = '123';
      const existingUser = {
        id: userId,
        email: 'test@example.com',
        preferences: { email: true, push: false },
      };

      const newPreferences = { email: false, push: true };

      mockRepository.findOne.mockResolvedValue(existingUser);
      mockRepository.save.mockResolvedValue({
        ...existingUser,
        preferences: newPreferences,
      });

      const result = await service.updatePreferences(userId, newPreferences);

      expect(result.preferences).toEqual(newPreferences);
      expect(mockLoggingService.logWithCorrelation).toHaveBeenCalledWith(
        'user_preferences_updated',
        expect.objectContaining({
          user_id: userId,
          status_change: {
            from: { email: true, push: false },
            to: newPreferences,
          },
        }),
      );
    });
  });
});
