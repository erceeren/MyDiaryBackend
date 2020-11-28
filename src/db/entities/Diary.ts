import {Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique} from "typeorm";
import {User} from "./User";

enum Type {
    Private = 'private',
    Public = 'public',
    Friends = 'friends'
}



@Entity()
@Unique("uniqueuserdate", ["user", "date"])
export class Diary {

    constructor(user: User, title: string, content: string, date: Date, type: Type, created_at: Date = new Date()) {
        this.user = user;
        this.title = title;
        this.content = content;
        this.date = date;
        this.type = Type[type];
        this.created_at = created_at;
    }

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.diaries)
    user: User

    @Column()
    date: Date

    @Column()
    title: string

    @Column()
    content: string

    @Column({
        type: "enum",
        enum: Type,
        default: Type.Private
    })
    type: Type

    @Column()
    created_at: Date

}