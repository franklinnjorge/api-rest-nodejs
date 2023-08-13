import { knex as setupKnex, Knex } from 'knex'
import { env } from '../env'

if (!process.env.DATABASE_URL) {
  throw new Error('database info not found')
}

export const config: Knex.Config = {
  client: 'sqlite',
  connection: {
    filename: env.DATABASE_URL,
  },
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: './database/migrations',
  },
}

export const knex = setupKnex(config)