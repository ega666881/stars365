import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('users', function(table: Knex.CreateTableBuilder) {
        table.increments('id').primary()
        table.bigInteger('telegram_id')
        table.string('first_name')
        table.string('last_name')
        table.string('username')
        table.string('photo_url')
        table.timestamp('createdAt')
        table.timestamp('lastActive')
        table.boolean('subscripted').defaultTo(false).notNullable()
        table.timestamp('subscriptionEndDate').nullable()
    })

}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('users')    
}

