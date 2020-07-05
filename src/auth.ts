import { User } from "./entity/User";
import { sign } from "jsonwebtoken";

export const createAccessToken = (user: User) =>
  sign({ userId: user.id }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: "15m",
  });

export const createRefreshToken = (user: User) =>
  sign({ userId: user.id }, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: "7d",
  });
