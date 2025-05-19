import { Injectable } from '@nestjs/common';
import { KNEX_INSTANCE } from '../database/database.constants';
import { Inject } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(@Inject(KNEX_INSTANCE) private readonly knex: any) {}

  async findOrCreateUser(userData: any) {
    const [user] = await this.knex('users')
      .where({ telegram_id: userData.id })
      .select('*');

    if (user) {
      return user;
    }

    const [newUser] = await this.knex('users')
      .insert({
        telegram_id: userData.id,
        first_name: userData.first_name,
        last_name: userData.last_name || null,
        username: userData.username || null,
        photo_url: userData.photo_url || null
      })
      .returning('*');

    return newUser;
  }
}