import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { IUserLogin } from './socket.interface';
import { KNEX_INSTANCE, tableNames } from '../database/database.constants';
import { Knex } from 'knex';
import { Global, Inject } from '@nestjs/common';
import { IUser } from 'src/users/users.interface';

@Global()
@WebSocketGateway({ cors: true })
export class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

    constructor(@Inject(KNEX_INSTANCE) private readonly knex: Knex) {}

    @WebSocketServer()
    server: Server;  

    afterInit(server: any) {
        console.log('WebSocket сервер инициализирован');
    }

    handleConnection(client: Socket) {
        console.log(`Клиент подключен: ${client.id}`);
    }

    async handleDisconnect(client: Socket) {
        console.log(`Клиент отключен: ${client.id}`);
        await this.knex<IUser>(tableNames.users).update({isActive: false, socketId: null}).where({socketId: client.id})
    }

    @SubscribeMessage('userLogin')
    async handleUserLogin(@MessageBody() data: IUserLogin, @ConnectedSocket() client: Socket) {
        
        await this.knex<IUser>(tableNames.users).update({isActive: true, socketId: client.id}).where({id: data.id})
        return data;
    }

    @SubscribeMessage('join-x10-room')
    async handleJoin(client, payload) {
      const { userId, avatar, betValue } = payload;
      const user = await this.knex(tableNames.users).select('*').where({id: userId}).first()
      if (user.balance < betValue) {
        return
      }
      console.log('join')
      let room = await this.findOrCreateRoom(betValue);
      const roomUser = await this.knex(tableNames.room_users).select("*").where({user_id: userId}).first()
      if (!roomUser) {
        await this.joinRoom(room.id, userId, avatar);
        await this.knex(tableNames.users).update({balance: this.knex.raw(`balance - ${betValue}`)}).where({id: userId})
      }
      const users = await this.getRoomUsers(room.id);
      
      // Обновляем всех участников
      this.server.to(room.id.toString()).emit('room-update', users);

      if (users.length === 2) {
          setTimeout(async () => {
            const winnerUserId = await this.startGame(room.id);
            console.log(winnerUserId)
            this.server.to(room.id.toString()).emit('game-started', { winnerUserId });
            setTimeout(async () => {
              await this.deleteRoom(room.id)
              await this.knex(tableNames.users).update({balance: this.knex.raw(`balance + ${room.betValue}`)}).where({id: winnerUserId})
            }, 10000)
          }, 8000)
      }

      client.join(room.id.toString());
      console.log(client.id, "событие")
    }

    async deleteRoom(roomId: number): Promise<void> {
        await this.knex('room_users').where('room_id', roomId).del();
        await this.knex('rooms').where('id', roomId).del();
      }

    @SubscribeMessage('get-active-users-count')
    async handleUserLogout(@ConnectedSocket() client: Socket) {
        const activeUsers = await this.knex(tableNames.users).count("* as total").where({isActive: true}).first()
        const settings = await this.knex(tableNames.settings).select('*').first()
        const winsHistory = await this.knex(tableNames.winsHistory).select('*').orderBy('id', 'desc');
        //@ts-ignore
        this.server.emit('active-users-count', {total: activeUsers.total, clientId: client.id, settings: settings, winsHistory: winsHistory})
    }

    async findOrCreateRoom(betValue): Promise<any> {
        const activeRooms = await this.knex('rooms')
          .where('is_active', true)
          .andWhereRaw('(SELECT COUNT(*) FROM room_users WHERE room_users.room_id = rooms.id) < 10')
          .andWhere({betValue: betValue})
    
        if (activeRooms.length > 0) {
          return activeRooms[0];
        }
    
        // Создаем новую комнату
        const [newRoom] = await this.knex('rooms').insert({ is_active: true, betValue: betValue }).returning('*');
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
        if (users.length < 2) return null;
    
        const winnerIndex = Math.floor(Math.random() * users.length);
        return users[winnerIndex].user_id;
      }
}