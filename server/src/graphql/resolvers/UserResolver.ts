import { Profile } from "@prisma/client";
import { UserInputError } from "apollo-server-express";
import argon from "argon2";
import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  ID,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
} from "type-graphql";
import { MyContext } from "../../types";
import { caseInsensitivePrisma } from "../../util/caseInsensitive";
import FieldError from "../entities/FieldError";
import User from "../entities/User";

@InputType()
class UserRegisterInput {
  @Field()
  username!: string;

  @Field()
  email!: string;

  @Field()
  password!: string;
}

@InputType()
class UserLoginInput {
  @Field()
  usernameOrEmail!: string;

  @Field()
  password!: string;
}

@ObjectType()
class UserResponse {
  @Field((type) => User, { nullable: true })
  user?: User;

  @Field((type) => [FieldError], { nullable: true })
  errors?: FieldError[];
}

@Resolver((of) => User)
export default class UserResolver {
  @FieldResolver()
  email(@Root() user: User, @Ctx() { req }: MyContext): string | null {
    if (req.session.id !== user.id) {
      return "";
    }

    return user.email;
  }

  @FieldResolver()
  followers(@Root() user: User, @Ctx() { prisma }: MyContext): Promise<User[]> {
    return prisma.user.findMany({
      where: {
        following: {
          some: {
            userId: user.id,
            following: true,
          },
        },
      },
    });
  }

  @FieldResolver()
  following(@Root() user: User, @Ctx() { prisma }: MyContext): Promise<User[]> {
    return prisma.user.findMany({
      where: {
        followers: {
          some: {
            followerId: user.id,
            following: true,
          },
        },
      },
    });
  }

  @FieldResolver()
  async profile(
    @Root() user: User,
    @Ctx() { prisma }: MyContext
  ): Promise<Profile | null> {
    const profile = await prisma.profile.findUnique({
      where: {
        userId: user.id,
      },
    });

    return profile;
  }

  @Query((returns) => User, { nullable: true })
  async userById(
    @Arg("id", (type) => ID) id: string,
    @Ctx() { prisma }: MyContext
  ): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    return user;
  }

  @Query((returns) => User, { nullable: true })
  async userByUsername(
    @Arg("username") username: string,
    @Ctx() { prisma }: MyContext
  ): Promise<User | null> {
    const user = await prisma.user.findFirst({
      where: {
        username: caseInsensitivePrisma(username),
      },
    });

    if (!user) {
      throw new UserInputError("User not found.");
    }

    return user;
  }

  @Query((returns) => User, { nullable: true })
  async me(@Ctx() { req, prisma }: MyContext): Promise<User | null> {
    if (!req.session.userId) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: {
        id: req.session.userId,
      },
    });

    return user;
  }

  @Mutation((returns) => Boolean)
  async logout(@Ctx() { req, res }: MyContext): Promise<boolean> {
    return new Promise((resolve) => {
      req.session.destroy((err) => {
        res.clearCookie("qid");
        if (err) {
          resolve(false);
        }

        resolve(true);
      });
    });
  }

  @Mutation((returns) => UserResponse)
  async register(
    @Arg("options", (type) => UserRegisterInput) options: UserRegisterInput,
    @Ctx() { req, prisma }: MyContext
  ): Promise<UserResponse> {
    const errors: FieldError[] = [];

    if (options.username.length < 3) {
      errors.push({
        field: "username",
        message: "Username must be at least 3 characters long.",
      });
    }

    if (options.password.length < 3) {
      errors.push({
        field: "password",
        message: "Password must be at least 3 characters long.",
      });
    }

    const existingUsername = await prisma.user.findFirst({
      where: {
        username: caseInsensitivePrisma(options.username),
      },
    });
    if (existingUsername) {
      errors.push({
        field: "username",
        message: "Username already exists.",
      });
    }

    const existingEmail = await prisma.user.findFirst({
      where: {
        email: caseInsensitivePrisma(options.email),
      },
    });
    if (existingEmail) {
      errors.push({
        field: "email",
        message: "Email already exists.",
      });
    }

    if (errors.length) {
      return { errors };
    }

    const hashedPassword = await argon.hash(options.password);

    const user = await prisma.user.create({
      data: {
        ...options,
        password: hashedPassword,
      },
    });

    req.session.userId = user.id;

    return { user };
  }

  @Mutation((returns) => UserResponse)
  async login(
    @Arg("options", (type) => UserLoginInput) options: UserLoginInput,
    @Ctx() { prisma, req }: MyContext
  ): Promise<UserResponse> {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username: caseInsensitivePrisma(options.usernameOrEmail) },
          { email: caseInsensitivePrisma(options.usernameOrEmail) },
        ],
      },
    });

    if (!user) {
      return {
        errors: [
          { field: "usernameOrEmail", message: "Username or email not found." },
        ],
      };
    }

    if (!(await argon.verify(user.password, options.password))) {
      return {
        errors: [
          {
            field: "password",
            message: "Incorrect password.",
          },
        ],
      };
    }

    req.session.userId = user.id;

    return { user };
  }
}
