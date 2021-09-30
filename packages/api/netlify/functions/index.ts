import serverlessExpress from '@vendia/serverless-express'
import { createApp } from '../../src'
import { createConnection } from 'mysql2/promise'
import { Handler } from 'aws-lambda'

let serverlessExpressInstance: Handler

const setup: Handler = async (event, context, callback) => {
    const mysql = await createConnection(process.env.MYSQL_CONNECTION_URI!)
    const app = await createApp({ mysql })
    serverlessExpressInstance = serverlessExpress({ app })
    return serverlessExpressInstance(event, context, callback)
}

const handler: Handler = (event, context, callback) => {
    if (serverlessExpressInstance)
        return serverlessExpressInstance(event, context, callback)

    return setup(event, context, callback)
}

exports.handler = handler
