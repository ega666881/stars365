import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("betsPulls").del();

    // Inserts seed entries
    try {
        await knex("betsPulls").insert([
            {betValue: 1},
            {betValue: 5},
            {betValue: 10},
            {betValue: 50},
            {betValue: 100},
            {betValue: 500},
            {betValue: 1000},
            {betValue: 5000},
        ]);
    } catch {}
};
