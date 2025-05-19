import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('betsPulls', function(table: Knex.CreateTableBuilder) {
        table.increments('id').primary()
        table.integer('betValue').notNullable()
        table.float('x10').notNullable().defaultTo(0)
        table.float('x3').notNullable().defaultTo(0)
        table.float('x1').notNullable().defaultTo(0)
    })

    // await knex.schema.createTable('winBetsHistory', function(table: Knex.CreateTableBuilder) {
    //     table.increments('id').primary()
    //     table.integer('betId').unsigned()
    //     table.foreign('betId').references('betsPull.id').onDelete('cascade')

    // })

}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('betsPulls')    
}



