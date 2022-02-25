// Write your tests here
const request = require('supertest')
const server = require('./server')
const db = require('../data/dbConfig')

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})
afterAll(async () => {
  await db.destroy()
})

test('sanity', () => {
  expect(false).toBe(false)
})

describe('POST /api/auth/register', () => {
  test('returns correct status upon adding new user', async () => {
    const res = await request(server)
      .post('/api/auth/register')
      .send({ username: 'foo', password: 'bar'})
    expect(res.status).toBe(200)
  })
  test('returns correct error when username or password is missing', async () => {
    const res = await request(server)
      .post('/api/auth/register')
      .send({ username: 'foo' })
    expect(res.body.message).toBe('username and password required')
  })
})

describe('POST /api/auth/login', () => {
  test('returns correct status upon logging in', async () => {
    await request(server)
      .post('/api/auth/register')
      .send({ username: 'foo', password: 'bar'})
    const res = await request(server)
      .post('/api/auth/login')
      .send({ username: 'foo', password: 'bar'})
    expect(res.status).toBe(200)
  })
  test('incorrect password return invalid credentials', async () => {
    await request(server)
      .post('/api/auth/register')
      .send({ username: 'foo', password: 'bar'})
    const res = await request(server)
      .post('/api/auth/login')
      .send({ username: 'foo', password: 'yeet'})
    expect(res.body.message).toBe('invalid credentials')
  })
})

describe('GET /api/jokes', () => {
  test('returns correct status when not logged in', async () => {
    const res = await request(server)
      .get('/api/jokes')
    expect(res.status).toBe(401)
  })
  test('returns correct status when logged in', async () => {
    await request(server)
      .post('/api/auth/register')
      .send({ username: 'foo', password: 'bar'})
    await request(server)
      .post('/api/auth/login')
      .send({ username: 'foo', password: 'bar'})
    const res = await request(server)
      .get('/api/jokes')
    expect(res.status).toBe(200)
  })
})
