import {Request, Response} from "express";
import {getRepository} from "typeorm";
import {User} from '../db/entities/User';
import * as jwt from "jsonwebtoken";
const config = require("../../config.json")

export async function search(request: Request, response: Response) {

    const name = request.body.value;
    const users = await getRepository(User).createQueryBuilder("user").leftJoinAndSelect("user.friends", "friends").leftJoinAndSelect("user.to_friends", "to_friends").where("user.firstname || \' \' || user.lastname LIKE '%' || :name || '%'", {name: name}).getMany()
    let result = [];
    for (let user of users) {
        const friends_list = [...user.friends.map(friend => friend.id), ...user.to_friends.map(friend => friend.id)];
        // @ts-ignore
        result.push({firstname: user.firstname, lastname: user.lastname, email: user.email, friends: friends_list, id:user.id})
    }
    response.send(result);
}


export async function addFriend(request: Request, response: Response){
    const query = await getRepository(User).createQueryBuilder("user").leftJoinAndSelect("user.friends", "friends").leftJoinAndSelect("user.to_friends", "to_friends");
    const token = jwt.verify(request.body.token, config.secret);
    // @ts-ignore
    const userId = token.id;
    const friendId = request.body.friendId;
    const user = await query.where("user.id = :userId", {userId: userId}).getOne()
    if (user) {
        const friends = user.all_friends();
        for (let index = 0; index < user.all_friends().length; index++) {
            if (friends[index].id === friendId) {
                response.send({error: "You are already friend"})
                return
            }
        }
        const friendUser = await query.where("user.id = :userId", {userId: friendId}).getOne()
        if (friendUser) {
            user.friends.push(friendUser)
            await getRepository(User).save(user)
            response.send({friend: {id: friendUser.id, firstname: friendUser.firstname, lastname: friendUser.lastname, email: friendUser.email}})
            return;
        }

    }
    response.send({error: "Something went wrong"})
}

export async function getFriends(request: Request, response: Response) {
    const query = await getRepository(User).createQueryBuilder("user").leftJoinAndSelect("user.friends", "friends").leftJoinAndSelect("user.to_friends", "to_friends");
    const token = jwt.verify(request.body.token, config.secret);
    // @ts-ignore
    const userId = token.id;
    const user = await query.where("user.id = :userId", {userId: userId}).getOne()
    if (user) {
        response.send({friends: user.all_friends().map(friend => {
                return {id: friend.id, firstname: friend.firstname, lastname: friend.lastname, email: friend.email}
            })})
    }
}