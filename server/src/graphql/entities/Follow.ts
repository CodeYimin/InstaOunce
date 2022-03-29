import { Field, ID, ObjectType } from "type-graphql";
import User from "./User";

@ObjectType()
export default class Follow {
  @Field((type) => ID)
  id!: string;

  @Field((type) => Boolean)
  following!: boolean;

  @Field((type) => User)
  user!: User;

  @Field((type) => User)
  follower!: User;
}
