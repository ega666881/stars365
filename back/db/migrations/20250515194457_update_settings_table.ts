import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable('settings', function(table: Knex.CreateTableBuilder) {
        table.timestamp("lotteryDate").nullable()
    })

}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable('settings', function(table: Knex.CreateTableBuilder) {
        table.dropColumns('lotteryDate')
    })

}

