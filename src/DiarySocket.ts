import {Socket} from "socket.io";
import {getRepository, Repository} from "typeorm";
import {Message} from "./db/entities/Message";
import {User} from "./db/entities/User";
import * as jwt from "jsonwebtoken";
const config = require("../config.json")

const SEND_MESSAGE = "SEND_MESSAGE";
const SEND_ID = "SEND_ID";
const disconnect = "disconnect";

let sockets: DiarySocket[] = [];

class DiarySocket {

    id: number
    socket: Socket
    user: User
    userRepository: Repository<User>
    messageRepository: Repository<Message>

    constructor(socket: Socket, id: number = 0) {
        this.id = id;
        this.socket = socket;
        this.userRepository = getRepository(User);
        this.messageRepository = getRepository(Message);

        sockets.push(this);
        this.socket_onConnection()
    }

    socket_onConnection = async () => {
        this.socket.on(SEND_MESSAGE,  async (data) => {

            const receiver = await this.userRepository.findOne({id: data.receiverId})
            const content = data.content;

            let socketFound = false;

            for (let i = 0; i < sockets.length; i++) {
                if ( sockets[i].id === data.receiverId) {
                    socketFound = true;
                    sockets[i].socket.emit("message/" + this.id, data)
                }
            }

            if ( this.user && receiver) {
                const newMessage = new Message(this.user, receiver, content, new Date(Date.now()), socketFound)
                const message = this.messageRepository.create(newMessage)
                await this.messageRepository.save(message)
            }

            this.socket.emit("message/" + data.receiverId, data)
        })
        this.socket.on(SEND_ID, data => {
            const token = jwt.verify(data, config.secret);
            // @ts-ignore
            this.id = token.id;
            this.userRepository.findOne({id: this.id}).then(user => {
                if (user) {
                    this.user = user;
                }
            })
        })
        this.socket.on(disconnect, () => {
            this.socket_onClose()
        })
    }


    socket_onClose = () => {
        for (let i = 0; i < sockets.length; i++) {
            if (sockets[i] === this) {
                sockets.splice(i, 1);
            }
        }
    }

}

export default DiarySocket