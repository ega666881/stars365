import { Injectable } from '@nestjs/common';
import { KNEX_INSTANCE, tableNames } from '../database/database.constants';
import { Inject } from '@nestjs/common';
import { Knex } from 'knex';
import * as dotenv from 'dotenv-ts';
import { IBetPull, ISettings, IUser } from './users.interface';
dotenv.config();

@Injectable()
export class UsersRepository {
    constructor(@Inject(KNEX_INSTANCE) private readonly knex: Knex) {}

    async getUsers(subscripted?: boolean, userId?: number, tgId?: number): Promise<IUser | IUser[]> {
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
