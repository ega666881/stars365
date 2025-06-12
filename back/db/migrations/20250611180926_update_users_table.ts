import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable('users', function(table: Knex.CreateTableBuilder) {
        table.string('wallet').nullable()
    })

}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable('users', function(table: Knex.CreateTableBuilder) {
        table.dropColumn('wallet')
    })

}

