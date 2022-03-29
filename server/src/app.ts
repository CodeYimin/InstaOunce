import { PrismaClient } from "@prisma/client";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { ApolloServer } from "apollo-server-express";
import "class-validator";
import cors from "cors";
import express from "express";
import session from "express-session";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import FollowResolver from "./graphql/resolvers/FollowResolver";
import ProfileResolver from "./graphql/resolvers/ProfileResolver";
import UserResolver from "./graphql/resolvers/UserResolver";
import { MyContext } from "./types";

const PORT = process.env.PORT || 4000;

async function main() {
  const prisma = new PrismaClient();

  const app = express();

  app.use(cors({ origin: "http://localhost:3000", credentials: true }));

  app.use(
    session({
      name: "qid",
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
        httpOnly: true,
        sameSite: "lax",
      },
      secret: "qjlkrxcha.crgpalouchsmb'k'vwqmjbkshn",
      resave: false,
      saveUninitialized: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver, ProfileResolver, FollowResolver],
    }),
    context: ({ req, res }): MyContext => ({ req, res, prisma }),
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground],
  });
  await apolloServer.start();

  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/graphql`);
  });
}

main();
