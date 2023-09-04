import { execSync } from 'node:child_process'
import request from 'supertest'
import { afterAll, beforeAll, describe, beforeEach, expect, it } from 'vitest'
import { app } from '../src/app'


describe('Transactions routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:latest')
  })

  it('should be able to create a new transaction', async () => {
    await request(app.server)
      .post('/transactions')
      .send({
        title: 'New Transaction',
        amount: 5000,
        type: 'credit'
      })
      .expect(201)
  })

  it('should be able to list all transactions', async () => {
    const createTransactionsResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'New Transaction',
        amount: 5000,
        type: 'credit'
      })

    const cookies = createTransactionsResponse.get('Set-Cookie')

    const listTransactionsResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200)

    expect(listTransactionsResponse.body.transactions).toEqual([
      expect.objectContaining({
        title: 'New Transaction',
        amount: 5000,
      })
    ])

  })

  it('should be able to get a specific transaction', async () => {
    const createTransactionsResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'New Transaction',
        amount: 5000,
        type: 'credit'
      })

    const cookies = createTransactionsResponse.get('Set-Cookie')

    const listTransactionsResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200)

    const transactionId = listTransactionsResponse.body.transactions[0].id

    const getTransactionResponse = await request(app.server)
      .get(`/transactions/${transactionId}`)
      .set('Cookie', cookies)
      .expect(200)

    expect(getTransactionResponse.body.transaction).toEqual(
      expect.objectContaining({
        title: 'New Transaction',
        amount: 5000,
      })
    )

  })

  it('should be able to get the summary', async () => {
    const createTransactionsResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'Credit Transaction',
        amount: 5000,
        type: 'credit'
      })

    const cookies = createTransactionsResponse.get('Set-Cookie')
    
    await request(app.server)
    .post('/transactions')
    .set('Cookie', cookies)
    .send({
      title: 'Debit Transaction',
      amount: 2500,
      type: 'debit'
    })


    const summaryTransaction = await request(app.server)
      .get('/transactions/summary')
      .set('Cookie', cookies)
      .expect(200)


    expect(summaryTransaction.body.summary).toEqual(
      expect.objectContaining({
        amount: 2500,
      })
    )

  })


})


