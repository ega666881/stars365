import { Injectable } from '@nestjs/common';
import { KNEX_INSTANCE, tableNames } from '../database/database.constants';
import { Inject } from '@nestjs/common';
import { Knex } from 'knex';
import * as dotenv from 'dotenv-ts';
import { IBetPull, ISettings, ITransaction, IUser, IWinsHistory } from './users.interface';
dotenv.config();

@Injectable()
export class UsersRepository {
    constructor(@Inject(KNEX_INSTANCE) private readonly knex: Knex) {}

    async getUsers(subscripted?: boolean, userId?: number, tgId?: number, username?: string): Promise<IUser | IUser[]> {
        const query = this.knex(tableNames.users)
                .select([
                    `${tableNames.users}.*`,
                    this.knex(tableNames.referals)
                    .select(this.knex.raw('row_to_json(inviter.*)'))
                    .join(`${tableNames.users} as inviter`, 'referals.userId', 'inviter.id')
                    .whereRaw(`referals."referalId" = ??`, [`${tableNames.users}.id`])
                    .as('referalUser'),
                    this.knex(tableNames.referals)
                    .select(this.knex.raw(`COALESCE(json_agg(jsonb_build_object('user', referred.*, 'reward', referals.reward)), '[]'::json)`))
                    .join(`${tableNames.users} as referred`, 'referals.referalId', 'referred.id')
                    .whereRaw(`referals."userId" = ??`, [`${tableNames.users}.id`])
                    .as('referals')
                ]);

        subscripted && query.where({ subscripted: true })
        userId && query.where(`${tableNames.users}.id`, userId).first()
        tgId && query.where({ telegram_id: tgId }).first()
        username && query.where({ username: username }).first()
        //@ts-ignore
        return query
    }

    async getEveryDayReward() {
        return this.knex<IUser>(tableNames.users)
            .count('* as total')
            .where({subscripted: true})
            .first()
    }

    async updateUser(updatedData: IUser, userId?: number, telegram_id?: number): Promise<IUser> {
        const query = this.knex(tableNames.users).update(updatedData)

        userId && query.where({id: userId})
        telegram_id && query.where({telegram_id: telegram_id})

        query.returning('*')

        const updatedUser = await query
        return updatedUser[0]
    }

    async getRoomUser(userId: number) {
        const userRoom = await this.knex(tableNames.room_users)
            .select('room_id')
            .where({ user_id: userId })
            .first();

        if (!userRoom || !userRoom.room_id) {
            return { room: null }; // или throw new Error(...)
        }
        const room = await this.knex(tableNames.rooms)
                .leftJoin(tableNames.room_users, `${tableNames.rooms}.id`, `${tableNames.room_users}.room_id`)
                .select([
                `${tableNames.rooms}.*`,
                this.knex.raw(`JSON_AGG(${tableNames.room_users}.*) FILTER (WHERE ${tableNames.room_users}.id IS NOT NULL) AS players`)
                ])
                .where({ [`${tableNames.rooms}.id`]: userRoom.room_id })
                .groupBy(`${tableNames.rooms}.id`)
                .first();

        return room
    }

    async addWinHistory(insertData: IWinsHistory) {
        await this.knex(tableNames.winsHistory).insert(insertData)
        return true
    }

    async addCompleteTaskUser(userId: number, taskId: number) {
        await this.knex(tableNames.tasksUsers).insert({userId: userId, taskId: taskId})
        return true
    }

    async getTasks(taskId?: number) {
        const query =  this.knex(tableNames.tasks).select('*')
        taskId && query.where({id: taskId}).first()
        return query

    }

    async getTopUsers(userId?: number) {
        const balanceTopQuery = this.knex(tableNames.users)
            .select('*')
            .limit(20)
            .orderBy('balance', 'desc')
        
        const candyTopQuery = this.knex(tableNames.users)
            .select('*')
            .limit(20)
            .orderBy('candy', 'desc')

        const [balanceTop, candyTop] = await Promise.all([balanceTopQuery, candyTopQuery])
        
        return {
            balanceTop: balanceTop,
            candyTop: candyTop
        }
    }

    async getTransactions(userId: number) {
        return this.knex(tableNames.transactions).select('*').where({userId: userId, active: true})
    }

    async createTransaction(userId: number, amount: number = 0.1): Promise<ITransaction> {
        await this.knex(tableNames.transactions).delete().where({userId: userId})
        const transaction = await this.knex(tableNames.transactions).insert({userId: userId, amount: amount}).returning('*')
        return transaction[0]
    }


    async getTransactionById(id: number) {
        return this.knex(tableNames.transactions).select('*').where({id: id, active: true}).first()
    }

    async setTransactionInactive(transactionId: number) {
        return this.knex(tableNames.transactions).update({active: false}).where({id: transactionId})
    }

    async getBetsValue() {
        return this.knex(tableNames.betsPulls).select(['betValue as value', 'id']).orderBy('id', 'asc')
    }

    async betValueUpdate(updatedData: IBetPull, betId: number) {
        const [updatedRow] = await this.knex(tableNames.betsPulls).update(updatedData).where({id: betId}).returning('*')
        return updatedRow
    }

    async getBetsPulls(betId?: number): Promise<IBetPull | IBetPull[]> {
        const query = this.knex(tableNames.betsPulls).select('*')
        betId && query.where('id', betId).first()

        return query
    }

    async addReferalToUser(userId: number, referalId: number) {
        await this.knex(tableNames.referals).insert({userId: userId, referalId: referalId})
        return true
    }

    async createUser(insertData: IUser): Promise<IUser> {
        const [newUser] = await this.knex(tableNames.users)
            .insert({...insertData, createdAt: new Date(), lastActive: new Date()})
            .returning('*');

        return newUser;
    }

    async updateSettings(updatedData: ISettings): Promise<IUser> {
        const [updatedSettings] = await this.knex(tableNames.settings).update(updatedData).where({id: 1}).returning('*')
        return updatedSettings
    }

    async getSettings(): Promise<ISettings> {
        return this.knex(tableNames.settings).select('*').first()
    }

}
