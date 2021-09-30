import 'source-map-support/register'
import serverlessExpress from '@vendia/serverless-express'
import { createApp } from '../../src'
import { createConnection } from 'mysql2/promise'
import { Handler } from 'aws-lambda'
import { Event } from '@netlify/functions/src/function/event'

let serverlessExpressInstance: Handler

const setup: Handler = async (event, context, callback) => {
    const mysql = await createConnection(process.env.DATABASE_URL!)
    const app = await createApp({ mysql })
    serverlessExpressInstance = serverlessExpress({ app })
    return serverlessExpressInstance(event, context, callback)
}

const stripNetlifyPath = (event: Event) => ({
    ...event,
    path: event.path.replace('/.netlify/functions/', '/'),
})

const handler: Handler = (event, context, callback) => {
    if (serverlessExpressInstance)
        return serverlessExpressInstance(
            {
                ...stripNetlifyPath(event),
                requestContext: context,
            },
            context,
            callback
        )

    return setup(
        { ...stripNetlifyPath(event), requestContext: context },
        context,
        callback
    )
}

exports.handler = handler
