import { Connection } from 'mysql2/promise'

export interface AppContext {
    mysql: Connection
    req: {
        user: { id: string }
    }
}
