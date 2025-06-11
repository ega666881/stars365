import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable('rooms', function(table: Knex.CreateTableBuilder) {
        table.integer('betValue')
    })

}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable('rooms', function(table: Knex.CreateTableBuilder) {
        table.dropColumn('betValue')
    })

}

