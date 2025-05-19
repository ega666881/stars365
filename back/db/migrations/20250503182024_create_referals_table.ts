import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('referals', function(table: Knex.CreateTableBuilder) {
        table.increments('id').primary()
        table.integer('userId').unsigned()
        table.foreign('userId').references('users.id').onDelete('cascade')
        table.integer('referalId').unsigned()
        table.foreign('referalId').references('users.id').onDelete('cascade')
    })

}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('referals')    
}



