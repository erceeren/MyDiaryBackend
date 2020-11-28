import {Request, Response} from "express";
import {getRepository} from "typeorm";
import {Message} from "../db/entities/Message";
import * as jwt from 'jsonwebtoken';
const config = require("../../config.json")

export async function getMessages(request: Request, response: Response) {
    const repository = getRepository(Message)
    const token = jwt.verify(request.body.token, config.secret);
    // @ts-ignore
    const messages = await repository.createQueryBuilder("message").leftJoinAndSelect("message.receiver", "receiver").where("(message.senderId = :senderId and message.receiverId = :receiverId) or (message.senderId = :receiverId and message.receiverId = :senderId)", {receiverId: token.id, senderId: request.body.friendId}).getMany()
    const result = messages.map(message => {
       return {receiverId: message.receiver.id, content: message.content}
    })
    response.send({messages: result});
}

export async function getUnReadMessages(request: Request, response: Response) {
    // @ts-ignore
    const token = jwt.verify(request.query.token, config.secret);
    // @ts-ignore
    const unReadMessages = await getRepository(Message).createQueryBuilder("message").leftJoinAndSelect("message.receiver", "receiver").leftJoinAndSelect("message.sender", "sender").where("message.receiver.id = :id and message.read = FALSE", {id: token.id}).getMany()
    const result: number[] = []
    if (unReadMessages.length !== 0) {
        for (let i = 0; i < unReadMessages.length; i++) {
            if (!result.includes(unReadMessages[i].sender.id)) {
                result.push(unReadMessages[i].sender.id)
            }
            unReadMessages[i].read = true;

        }
    }
    await getRepository(Message).save(unReadMessages)
    response.send({messages: result});
}