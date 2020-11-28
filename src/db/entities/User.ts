import {Entity, PrimaryGeneratedColumn, Column, JoinTable, ManyToMany, OneToMany} from "typeorm";
import {Message} from "./Message";
import {Diary} from "./Diary";

@Entity()
export class User {

    constructor(email: string, password: string, firstname: string, lastname: string) {
        this.email = email;
        this.password = password;
        this.firstname = firstname;
        this.lastname = lastname;
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    firstname: string;

    @Column()
    lastname: string;

    @JoinTable()
    @ManyToMany(() => User, user => user.to_friends)
    friends: User[];

    @ManyToMany(() => User, user => user.friends)
    to_friends: User[];

    @OneToMany(() => Message, message => message.receiver)
    receivedMessages: Message[]

    @OneToMany(() => Message, message => message.sender)
    sentMessages: Message[]

    @OneToMany(() => Diary, diary => diary.user)
    diaries: Diary[]

    all_friends() : User[] {
        return [...this.friends, ...this.to_friends]
    }

}
