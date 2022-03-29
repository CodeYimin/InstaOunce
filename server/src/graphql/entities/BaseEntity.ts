import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
export default class BaseEntity {
  @Field((type) => ID)
  id!: string;

  @Field((type) => String)
  createdAt!: Date;

  @Field((type) => String)
  updatedAt!: Date;
}
