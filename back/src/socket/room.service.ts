// room.service.ts
import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { KNEX_INSTANCE } from 'src/database/database.constants';

@Injectable()
export class RoomService {
  constructor(@Inject(KNEX_INSTANCE) private readonly knex: Knex) {}

  async findOrCreateRoom(): Promise<any> {
    const activeRooms = await this.knex('rooms')
      .where('is_active', true)
      .andWhereRaw('(SELECT COUNT(*) FROM room_users WHERE room_users.room_id = rooms.id) < 10');

    if (activeRooms.length > 0) {
      return activeRooms[0];
    }

    // Создаем новую комнату
    const [newRoom] = await this.knex('rooms').insert({ is_active: true }).returning('*');
    return newRoom;
  }

  async joinRoom(roomId: number, userId: number, avatar: string): Promise<void> {
    await this.knex('room_users').insert({ room_id: roomId, user_id: userId, avatar });
  }

  async getRoomUsers(roomId: number): Promise<any[]> {
    return this.knex('room_users').where('room_id', roomId).select('user_id', 'avatar');
  }

  async startGame(roomId: number): Promise<number | null> {
    const users = await this.getRoomUsers(roomId);
    if (users.length !== 10) return null;

    const winnerIndex = Math.floor(Math.random() * users.length);
    return users[winnerIndex].user_id;
  }
}