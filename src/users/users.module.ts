import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { LoggingService } from '../common/services/logging.service';
import { ClsModule } from 'nestjs-cls';

@Module({
  imports: [TypeOrmModule.forFeature([User]), ClsModule],
  controllers: [UsersController],
  providers: [UsersService, LoggingService],
})
export class UsersModule {}
