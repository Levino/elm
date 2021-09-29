import { todoResolvers as todos } from "./todos";

export const resolvers = {
  Query: {
    ...todos.Query,
  },
  Mutation: {
    ...todos.Mutation,
  },
};
