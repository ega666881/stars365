import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable('settings', function(table: Knex.CreateTableBuilder) {
        table.float('jackpod').notNullable().defaultTo(0)
        table.integer('spinCountJackpod').notNullable().defaultTo(0)
        table.integer('spinCountPresent').notNullable().defaultTo(0)
    })

}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable('settings', function(table: Knex.CreateTableBuilder) {
        table.dropColumn('jackpod')
        table.dropColumn('spinCountJackpod')
        table.dropColumn('spinCountPresent')
    })

}

