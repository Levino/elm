import { Context, setup, teardown } from '../test/testContext'
import { createApp } from './'
import request from 'supertest'
import { Express } from 'express'
import createJWKSMock, { JWKSMock } from 'mock-jwks'

describe('express app', () => {
    let context: Context
    let app: Express
    let jwks: JWKSMock
    let validToken: string
    beforeAll(async () => {
        jwks = createJWKSMock('https://hardfork.eu.auth0.com/')
        validToken = jwks.token({
            aud: 'https://api.todo.hardfork.io',
            iss: `https://hardfork.eu.auth0.com/`,
            id: 'user5',
        })
        jwks.start()
    })
    afterAll(async () => {
        await jwks.stop()
    })
    beforeEach(async () => {
        context = await setup()
        app = await createApp({ mysql: context.mysql })
    })

    afterEach(() => teardown(context))

    describe('Authentication', () => {
        it('should refuse access without token', () =>
            request(app)
                .post('/graphql')
                .send({
                    query: `
            {
              todos {
                description
              }
            }
          `,
                })
                .expect(401))
        it('should allow access with correct token', () =>
            request(app)
                .post('/graphql')
                .set('Authorization', `Bearer ${validToken}`)
                .send({
                    query: `
            {
              todos {
                description
              }
            }
          `,
                })
                .expect(200))
    })

    describe('Write and read', () => {
        it('Should be able to write and read a todo.', async () => {
            await request(app)
                .post('/graphql')
                .set('Authorization', `Bearer ${validToken}`)
                .send({
                    query: `mutation {addTodo(title: "title",description: "description")}`,
                })
                .expect(200)
                .then((response) =>
                    expect(response.body.data.addTodo).toEqual('1')
                )
            await request(app)
                .post('/graphql')
                .set('Authorization', `Bearer ${validToken}`)
                .send({
                    query: `
            {
              todos {
                description
              }
            }
          `,
                })
                .expect(200)
                .then((response) =>
                    expect(response.body?.data.todos?.[0].description).toEqual(
                        'description'
                    )
                )
        })
    })
})
