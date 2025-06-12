import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('transactions', function(table: Knex.CreateTableBuilder) {
        table.increments('id').primary()
        table.integer('userId').unsigned()
        table.foreign('userId').references('users.id').onDelete('cascade')
        table.float('amount').notNullable().defaultTo(0)
        table.boolean('active').notNullable().defaultTo(true)
        table.string('wallet').notNullable().defaultTo('')
    })

}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('transactions')
}

