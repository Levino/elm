import * as R from "ramda";
import { Connection } from "mysql2/promise";
const TODOS = "todos" as const;

interface TodoInput {
  title: string;
  description: string;
  userId: string;
}

interface Todo extends TodoInput {
  id: string;
}

export interface Database {
  todos: {
    create: (todo: TodoInput) => Promise<string>;
    getById: (userId: string) => (id: string) => Promise<Todo>;
  };
}

export const getById =
  (mysql: Connection) => (userId: string) => (id: string) =>
    mysql
      .query(
        `SELECT id, title, description FROM ${TODOS} where id LIKE ? AND userId like ?`,
        [id, userId]
      )
      .then(R.head)
      // @ts-ignore
      .then(R.head);

export const create = (mysql: Connection) => (todo: string) =>
  mysql
    .query(`INSERT INTO ${TODOS} SET ?`, todo)
    .then(R.path(["0", "insertId"]));

export const createDatabase: (mysql: Connection) => Database = R.applySpec({
  todos: {
    create,
    getById,
  },
});
