import fastify from 'fastify'
import { env } from '../env'
import { transactionsRoutes } from './routes/transactions'

const app = fastify()

/* app.get('/hello', async () => {
  const tables = await knex('sqlite_schema').select('*')
  const transactions = await knex('transactions').insert({
    id: crypto.randomUUID(),
    title: 'Transação teste',
    amount: 1000,
  })
  return transactions
}) */

app.register(transactionsRoutes)

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log('HTTP Server Running!')
  })
