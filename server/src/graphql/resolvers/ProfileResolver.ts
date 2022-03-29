import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { MyContext } from "../../types";
import Profile from "../entities/Profile";
import isAuth from "../middleware/isAuth";

@InputType()
class ProfileInput {
  @Field((type) => String, { nullable: true })
  firstName?: string | null;

  @Field((type) => String, { nullable: true })
  lastName?: string | null;

  @Field((type) => String, { nullable: true })
  bio?: string | null;

  @Field((type) => String, { nullable: true })
  avatar?: string | null;
}

@Resolver((of) => Profile)
export default class ProfileResolver {
  @UseMiddleware(isAuth)
  @Mutation((returns) => Profile)
  async updateProfile(
    @Arg("data", (type) => ProfileInput) data: ProfileInput,
    @Ctx() { req, prisma }: MyContext
  ): Promise<Profile> {
    const existingProfile = await prisma.profile.findUnique({
      where: { userId: req.session.userId },
    });

    if (!existingProfile) {
      return prisma.profile.create({
        data: {
          ...data,
          userId: req.session.userId!,
        },
      });
    }

    return prisma.profile.update({
      where: { id: existingProfile.id },
      data,
    });
  }
}
