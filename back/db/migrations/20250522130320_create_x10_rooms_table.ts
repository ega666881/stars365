import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('rooms', function(table: Knex.CreateTableBuilder) {
        table.increments('id').primary()
        table.timestamp('created_at')
        table.boolean('is_active').defaultTo(true)
    })

    await knex.schema.createTable('room_users', function(table: Knex.CreateTableBuilder) {
        table.increments('id').primary()
        table.integer('room_id').unsigned()
        table.foreign('room_id').references('rooms.id').onDelete('cascade')
        table.integer('user_id').unsigned()
        table.foreign('user_id').references('users.id').onDelete('cascade')
        table.string('avatar')
        table.timestamp('joined_at')
    })

}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('rooms') 
    await knex.schema.dropTable('room_users')    
}



