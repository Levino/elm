export const todoResolvers = {
  Query: {
    todos: () => {
      console.log("wurst");
      return [{ description: "Hallo" }];
    },
  },
  Mutation: {
    addTodo: () => void 0,
  },
};
