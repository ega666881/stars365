import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable('users', function(table: Knex.CreateTableBuilder) {
        table.timestamp("nextTakeDayReward").nullable()
        table.integer("dayRewardCount").notNullable().defaultTo(0)
    })

}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable('users', function(table: Knex.CreateTableBuilder) {
        table.dropColumns('lastTakeDayReward', 'dayRewardCount')
    })

}

