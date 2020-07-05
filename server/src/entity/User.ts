import { Field, Int, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@ObjectType()
@Entity("users")
export class User extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  // String is default graphql type
  @Field()
  @Column("text")
  email: string;

  // Not to be exposed
  @Column("text")
  password: string;

  @Column("int", { default: 0 })
  tokenVersion: number;
}
