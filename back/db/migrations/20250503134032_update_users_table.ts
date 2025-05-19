import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable('users', function(table: Knex.CreateTableBuilder) {
        table.bigInteger('candy').notNullable().defaultTo(0)
        table.bigInteger('balance').notNullable().defaultTo(0)
        table.bigInteger('winStarsBalance').notNullable().defaultTo(0)
    })

}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable('users', function(table: Knex.CreateTableBuilder) {
        table.dropColumns('candy', 'balance', 'winStarsBalance')
    })

}

