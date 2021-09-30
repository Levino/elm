import { AppContext } from '../types'
import { createDatabase } from '../database'

export const todoResolvers = {
    Query: {
        todos: (
            _: unknown,
            __: unknown,
            { mysql, req: { user } }: AppContext
        ) => createDatabase(mysql).todos.getAll(user.id),
    },
    Mutation: {
        addTodo: (
            _: unknown,
            todo: { description?: string; title: string },
            {
                mysql,
                req: {
                    user: { id },
                },
            }: AppContext
        ) => createDatabase(mysql).todos.create({ ...todo, userId: id }),
    },
}
