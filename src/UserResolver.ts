import { compare, hash } from "bcryptjs";
import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import {
  createAccessToken,
  createRefreshToken,
  sendRefreshToken,
} from "./auth";
import { User } from "./entity/User";
import { isAuth } from "./middlewares/isAuthMiddleware";
import { MyContext } from "./MyContext";

@ObjectType()
class LoginResponse {
  @Field()
  accessToken: string;
}

@Resolver()
export class UserResolver {
  @Query(() => String)
  @UseMiddleware(isAuth)
  protected(@Ctx() { payload }: MyContext) {
    return `I am protected route. User id is ${payload!.userId}`;
  }

  @Query(() => [User])
  users() {
    return User.find();
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
    };
  }
}
