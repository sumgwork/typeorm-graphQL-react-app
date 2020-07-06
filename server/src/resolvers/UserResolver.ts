import { compare, hash } from "bcryptjs";
import {
  Arg,
  Ctx,
  Field,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { getConnection } from "typeorm";
import {
  createAccessToken,
  createRefreshToken,
  sendRefreshToken,
} from "../auth";
import { User } from "../entity/User";
import { isAuth } from "../middlewares/isAuthMiddleware";
import { MyContext } from "../MyContext";
import { verify } from "jsonwebtoken";

@ObjectType()
class LoginResponse {
  @Field()
  accessToken: string;
  @Field(() => User)
  user: User;
}

@Resolver()
export class UserResolver {
  @Query(() => String)
  hello() {
    return "hi";
  }

  @Query(() => String)
  @UseMiddleware(isAuth)
  protected(@Ctx() { payload }: MyContext) {
    return `I am protected route. User id is ${payload!.userId}`;
  }

  @Query(() => [User])
  users() {
    return User.find();
  }

  @Query(() => User, { nullable: true })
  async me(@Ctx() context: MyContext) {
    const authorization = context.req.headers["authorization"];
    if (!authorization) {
      throw new Error("not authenticated");
    }
    try {
      const token = authorization?.split(" ")[1];
      if (!token) {
        throw new Error("not authenticated");
      }
      const payload: any = verify(token, process.env.ACCESS_TOKEN_SECRET!);
      context.payload = payload;
      return await User.findOne(payload.userId);
    } catch (error) {
      console.log(error);
      throw new Error("not authenticated");
    }
    return null;
  }

  @Mutation(() => Boolean)
  async register(
    @Arg("email") email: string,
    @Arg("password") password: string
  ) {
    const hashedPassword = await hash(password, 12);

    try {
      await User.insert({
        email,
        password: hashedPassword,
      });

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() { res }: MyContext) {
    sendRefreshToken(res, "");
    return true;
  }

  /**
   * Increment token version by 1
   */
  @Mutation(() => Boolean)
  async revokeRefreshTokensForUser(@Arg("userId", () => Int) userId: number) {
    await getConnection()
      .getRepository(User)
      .increment({ id: userId }, "tokenVersion", 1);
  }

  @Mutation(() => LoginResponse)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() { res }: MyContext
  ): Promise<LoginResponse> {
    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      throw new Error("invalid credentials");
    }

    const validPassword = await compare(password, user.password);
    if (!validPassword) {
      throw new Error("invalid credentials");
    }

    // login successful
    sendRefreshToken(res, createRefreshToken(user));
    res.cookie("jid", createRefreshToken(user), {
      httpOnly: true,
    });

    return {
      accessToken: createAccessToken(user),
      user,
    };
  }
}
