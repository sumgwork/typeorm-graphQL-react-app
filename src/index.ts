import { ApolloServer } from "apollo-server-express";
import { createConnection } from "typeorm";
// import { User } from "./entity/User";
import express from "express";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./UserResolver";

(async () => {
  const app = express();
  app.get("/", (_req, res) => {
    res.send("Hello");
  });

  // Connection to DB (PostgreSQL) through typeOrm
  await createConnection();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver],
    }),
    context: ({ req, res }) => ({ req, res }),
  });

  apolloServer.applyMiddleware({ app, path: "/graphql" });

  app.listen(4000, () => {
    console.log("Express server started!");
  });
})();
