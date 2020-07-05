import { verify } from "jsonwebtoken";
import { MiddlewareFn } from "type-graphql";
import { MyContext } from "../MyContext";

export const isAuth: MiddlewareFn<MyContext> = ({ context }, next) => {
  const authorization = context.req.headers["authorization"];

  try {
    const token = authorization?.split(" ")[1];
    if (!token) {
      throw new Error("not authenticated");
    }
    const payload: any = verify(token, process.env.ACCESS_TOKEN_SECRET!);
    context.payload = payload;
  } catch (error) {
    console.log(error);
    throw new Error("not authenticated");
  }
  return next();
};
