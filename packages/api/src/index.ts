import * as R from "ramda";
import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import express from "express";
import http from "http";
import { typeDefs } from "./schema";
import { resolvers } from "./resolvers";
import { Connection } from "mysql2/promise";

interface AppConfig {
  mysql: Connection;
}

export const createApp = async ({ mysql }: AppConfig) => {
  const app = express();
  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    formatError: R.tap(console.log),
    context: () => ({ mysql }),
  });
  await server.start();
  server.applyMiddleware({ app });
  return app;
};
