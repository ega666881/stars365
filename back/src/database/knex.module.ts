import { Module } from '@nestjs/common';
import { KnexProviderModule } from './knex.provider';
import * as dotenv from 'dotenv-ts';
dotenv.config();


@Module({
  imports: [KnexProviderModule]
})
export class DatabaseModule {}