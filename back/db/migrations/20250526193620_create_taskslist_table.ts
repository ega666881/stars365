import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('tasks', function(table: Knex.CreateTableBuilder) {
        table.increments('id').primary()
        table.string('title').defaultTo('')
        table.text('description').defaultTo('')
        table.string('type').defaultTo('')
        table.integer('countToReward').nullable()
        table.string('channel_url').nullable()
        table.integer('reward').defaultTo(0)
    })

    await knex.schema.createTable('tasksUsers', function(table: Knex.CreateTableBuilder) {
        table.increments('id').primary()
        table.integer('taskId').unsigned()
        table.foreign('taskId').references('tasks.id').onDelete('cascade')
        table.integer('userId').unsigned()
        table.foreign('userId').references('users.id').onDelete('cascade')

    })

}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('tasksUsers') 
    await knex.schema.dropTable('tasks')    
}



