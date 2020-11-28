import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./User";

@Entity()
export class Message {

    constructor(sender: User, receiver: User, content: string, date: Date, read=false) {
        this.sender = sender;
        this.receiver = receiver;
        this.content = content;
        this.date = date;
        this.read = read;
    }

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.sentMessages)
    sender: User;

    @ManyToOne(() => User, user => user.receivedMessages)
    receiver: User;

    @Column()
    content: string;

    @Column()
    date: Date;

    @Column()
    read: Boolean;

}