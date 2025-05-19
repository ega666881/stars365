import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable('users', function(table: Knex.CreateTableBuilder) {
        table.boolean('isActive').notNullable().defaultTo(false)
    })

}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable('users', function(table: Knex.CreateTableBuilder) {
        table.dropColumn('isActive')
    })

}

