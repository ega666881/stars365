import { knex } from 'knex';
import { Module } from '@nestjs/common';
import { KNEX_INSTANCE } from './database.constants';
import knexfile from 'db/knexfile';
import * as dotenv from 'dotenv-ts';
dotenv.config();
console.log(process.env.PG_PASSWORD)
@Module({
  providers: [
    {
      provide: KNEX_INSTANCE,
      useValue: knex(knexfile.development)
    }
  ],
  exports: [KNEX_INSTANCE]
})
export class KnexProviderModule {}