import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('winsHistory', function(table: Knex.CreateTableBuilder) {
        table.increments('id').primary()
        table.string('username').defaultTo('')
        table.string('value').defaultTo('')
        table.string('time').defaultTo('')
        table.string('photo_url').defaultTo('')
    })

}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('winsHistory')     
}



