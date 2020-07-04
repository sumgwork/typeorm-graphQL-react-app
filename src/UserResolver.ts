import {
  Resolver,
  Query,
  Mutation,
  Arg,
  ObjectType,
  Field,
} from "type-graphql";
import { User } from "./entity/User";
import { hash, compare } from "bcryptjs";
import { sign } from "jsonwebtoken";

@ObjectType()
class LoginResponse {
  @Field()
  accessToken: string;
}

@Resolver()
export class UserResolver {
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
    @Arg("password") password: string
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

    return {
      accessToken: sign({ userId: user.id }, "khgakhgfad", {
        expiresIn: "15m",
      }),
    };
  }
}
