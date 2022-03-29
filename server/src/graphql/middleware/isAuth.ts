import { AuthenticationError } from "apollo-server-express";
import { MiddlewareFn } from "type-graphql";
import { MyContext } from "../../types";

const isAuth: MiddlewareFn<MyContext> = ({ context }, next) => {
  if (!context.req.session.userId) {
    throw new AuthenticationError("Not logged in");
  }

  return next();
};

export default isAuth;
