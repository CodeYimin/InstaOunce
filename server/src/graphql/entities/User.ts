import { Field, ObjectType } from "type-graphql";
import BaseEntity from "./BaseEntity";
import Profile from "./Profile";

@ObjectType()
export default class User extends BaseEntity {
  @Field()
  username!: string;

  @Field((type) => String)
  email!: string;

  @Field((type) => Profile, { nullable: true })
  profile?: Profile | null;

  @Field((type) => [User])
  followers?: User[];

  @Field((type) => [User])
  following?: User[];
}
