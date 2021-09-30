import * as R from 'ramda'
import { ApolloServer } from 'apollo-server-express'
import express from 'express'
import { typeDefs } from './schema'
import { resolvers } from './resolvers'
import { Connection } from 'mysql2/promise'
import { auth } from './auth'

interface AppConfig {
    mysql: Connection
}

export const createApp = async ({ mysql }: AppConfig) => {
    const app = express()
    app.use(auth)
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: (context) => ({ ...context, mysql }),
    })
    await server.start()
    server.applyMiddleware({ app })
    return app
}
