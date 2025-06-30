import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { ObjectId } from "mongodb";

@Entity()
export class Todo {
    @PrimaryKey()
    _id!: ObjectId;

    @Property()
    title: string;

    @Property()
    completed: boolean;

    @Property({ type: 'json', nullable: true })
    attachments: { url: string, name: string }[] = [];

    @Property()
    createdAt: Date = new Date();
}