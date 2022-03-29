import { Arg, Ctx, ID, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { MyContext } from "../../types";
import Follow from "../entities/Follow";
import isAuth from "../middleware/isAuth";

@Resolver((of) => Follow)
export default class FollowResolver {
  @UseMiddleware(isAuth)
  @Mutation((returns) => Follow)
  async followUser(
    @Arg("userId", (type) => ID) userId: string,
    @Ctx() { prisma, req }: MyContext
  ): Promise<Follow> {
    const myUserId = req.session.userId;

    if (userId == myUserId) {
      throw new Error("Cannot follow yourself");
    }

    const existingFollow = await prisma.follow.findFirst({
      where: {
        userId: userId,
        followerId: myUserId,
      },
    });

    if (existingFollow) {
      if (existingFollow.following) {
        throw new Error("Already following");
      }

      const updatedFollow = await prisma.follow.update({
        where: {
          id: existingFollow.id,
        },
        data: {
          following: true,
        },
        include: {
          user: true,
          follower: true,
        },
      });

      return updatedFollow;
    }

    const newFollow = await prisma.follow.create({
      data: {
        userId: userId,
        followerId: myUserId!,
      },
      include: {
        user: true,
        follower: true,
      },
    });

    return newFollow;
  }

  @UseMiddleware(isAuth)
  @Mutation((returns) => Follow)
  async unfollowUser(
    @Arg("userId", (type) => ID) userId: string,
    @Ctx() { prisma, req }: MyContext
  ): Promise<Follow> {
    const follow = await prisma.follow.findFirst({
      where: {
        followerId: req.session.userId,
      },
    });

    if (!follow || !follow.following) {
      throw new Error("You are not following this person.");
    }

    const updatedFollow = await prisma.follow.update({
      where: {
        id: follow.id,
      },
      data: {
        following: false,
      },
      include: {
        user: true,
        follower: true,
      },
    });

    return updatedFollow;
  }
}
