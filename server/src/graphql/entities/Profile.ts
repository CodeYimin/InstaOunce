import { Field, ObjectType } from "type-graphql";
import BaseEntity from "./BaseEntity";

@ObjectType()
export default class Profile extends BaseEntity {
  @Field((type) => String, { nullable: true })
  firstName?: string | null;

  @Field((type) => String, { nullable: true })
  lastName?: string | null;

  @Field((type) => String, { nullable: true })
  bio?: string | null;

  @Field((type) => String, { nullable: true })
  avatar?: string | null;
}
