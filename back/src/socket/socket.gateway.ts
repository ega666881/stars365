import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { IUserLogin } from './socket.interface';
import { KNEX_INSTANCE, tableNames } from '../database/database.constants';
import { Knex } from 'knex';
import { Inject } from '@nestjs/common';
import { IUser } from 'src/users/users.interface';


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

    @SubscribeMessage('get-active-users-count')
    async handleUserLogout(@ConnectedSocket() client: Socket) {
        const activeUsers = await this.knex(tableNames.users).count("* as total").where({isActive: true}).first()
        
        //@ts-ignore
        this.server.emit('active-users-count', {total: activeUsers.total, clientId: client.id})
    }
}