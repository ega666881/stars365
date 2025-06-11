import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module'; // Подключение к БД через Knex
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { UsersModule } from './users/users.module';
import { DailyTaskService } from './lotteryStars/lotteryTaskServise';
import { SocketGateway } from './socket/socket.gateway';
import { SocketModule } from './socket/socket.module';


@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    SocketModule,
  ],
  controllers: [],
  providers: [DailyTaskService],
})
export class AppModule {}