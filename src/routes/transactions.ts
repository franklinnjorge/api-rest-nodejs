import { FastifyInstance } from 'fastify'
import crypto from 'node:crypto'
import { knex } from '../database'

export async function transactionsRoutes(app: FastifyInstance) {
  app.get('/hello', async () => {
    const transactions = await knex('transactions').select('*')
    /* const transactions = await knex('transactions').insert({
      id: crypto.randomUUID(),
      title: 'Transação teste',
      amount: 1000,
    }) */

    return transactions
  })
}
