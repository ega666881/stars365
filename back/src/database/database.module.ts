import { Module } from '@nestjs/common';
import { KnexProviderModule } from './knex.provider';

@Module({
  imports: [KnexProviderModule],
  exports: [KnexProviderModule]
})
export class DatabaseModule {}