import * as jwt from "jsonwebtoken";
import {Request, Response} from "express";
import {Diary} from '../db/entities/Diary';
import {getRepository} from "typeorm";
import {User} from "../db/entities/User";
const config = require("../../config.json");


function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

export async function addDiary(request: Request, response: Response) {
    const body = request.body;
    const token = jwt.verify(body.token, config.secret);
    // @ts-ignore
    const userId = token.id;
    const user = await getRepository(User).findOne({id: userId})
    if (user) {
        const newDiary = new Diary(user, body.title, body.content, body.date, body.type)
        await getRepository(Diary).save(newDiary);
    }
    response.send({success: ""})
}

export async function getFeeds(request: Request, response: Response) {
    // @ts-ignore
    const token = jwt.verify(request.query.token, config.secret);
    // @ts-ignore
    const limit: number  = request.query.limit;
    // @ts-ignore
    const userId = token.id;
    const user = await getRepository(User).createQueryBuilder("user").leftJoinAndSelect("user.friends", "friends").leftJoinAndSelect("user.to_friends", "to_friends").where("user.id = :id",{id: userId}).getOne()
    if (user) {
        const friends = user.all_friends();
        let ids = [];
        let friendDiaries = []
        if (friends.length) {
            // @ts-ignore
            ids = user.all_friends().map(user => user.id);
            // @ts-ignore
            friendDiaries = await getRepository(Diary).createQueryBuilder("diary").leftJoinAndSelect("diary.user", "user").where("diary.user.id in (:...ids) and diary.type = 'friends'", {ids: ids}).orderBy("diary.date").limit(5).offset((limit-1)*5).getMany();
        }

        const publicDiaries = await getRepository(Diary).createQueryBuilder("diary").leftJoinAndSelect("diary.user", "user").where("diary.type = 'public' and diary.user.id != :userId", {userId: userId}).orderBy("diary.date").limit(2).offset((limit-1)*2).getMany();
        let result = [...friendDiaries, ...publicDiaries];
        shuffleArray(result)
        response.send({diaries: result});
    }
}

export async function getMyDiaries(request: Request, response: Response) {
    // @ts-ignore
    const token = jwt.verify(request.query.token, config.secret);
    // @ts-ignore
    const userId = token.id;
    const diaries = await getRepository(Diary).createQueryBuilder("diary").leftJoinAndSelect("diary.user", "user").where("diary.userId= :userId",{userId: userId}).orderBy("diary.date", "DESC").getMany();
    response.send(diaries);
}

export async function newDiary(request: Request, response: Response) {

    // @ts-ignore
    const token = jwt.verify(request.query.token, config.secret);
    // @ts-ignore
    const userId = token.id;
    let date = new Date()
    response.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*'

    });
    response.flushHeaders();
    response.write("retry: 10000\n");
    while (true) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        const user = await getRepository(User).createQueryBuilder("user").leftJoinAndSelect("user.friends", "friends").leftJoinAndSelect("user.to_friends", "to_friends").where("user.id = :id",{id: userId}).getOne()
        if (user) {
            const friends = user.all_friends();
            let ids = [];
            let friendDiaries = []
            if (friends.length) {
                // @ts-ignore
                ids = user.all_friends().map(user => user.id);
                // @ts-ignore
                friendDiaries = await getRepository(Diary).createQueryBuilder("diary").leftJoinAndSelect("diary.user", "user").where("diary.user.id in (:...ids) and diary.type = 'friends' and diary.created_at > :date", {ids: ids, date: date}).orderBy("diary.date").getMany();
            }

            const publicDiaries = await getRepository(Diary).createQueryBuilder("diary").leftJoinAndSelect("diary.user", "user").where("diary.type = 'public' and diary.user.id != :userId and diary.created_at > :date", {userId: userId, date: date}).orderBy("diary.date").getMany();
            date = new Date();
            const newMessages = [...friendDiaries, ...publicDiaries];
            if (publicDiaries.length + friendDiaries.length) {
                response.write("data:" + JSON.stringify({messages: newMessages}) +"\n\n");
            }
        }
    }

}