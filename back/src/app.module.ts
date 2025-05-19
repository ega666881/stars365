import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module'; // Модуль авторизации
import { DatabaseModule } from './database/database.module'; // Подключение к БД через Knex
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { UsersModule } from './users/users.module';
import { DailyTaskService } from './lotteryStars/lotteryTaskServise';
import { SocketGateway } from './socket/socket.gateway';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [],
  providers: [DailyTaskService, SocketGateway],
})
export class AppModule {}