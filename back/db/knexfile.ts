import { dirname } from "path"
import path = require("path")
import * as dotenv from 'dotenv-ts'

// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */

interface KnexConfig {
  [key: string]: object
}

dotenv.config()


export default <KnexConfig> {
  development: {
    client: 'pg',
    connection: {
      host: process.env.PG_HOST,
      user: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      port: 5432,
      database: process.env.PG_DATABASE,
      
    },
    pool: {
      min: 0
    },
    migrations: {
      directory: "./migrations"
    }
  },
};
