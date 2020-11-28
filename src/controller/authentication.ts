import {Request, Response} from "express";
import {getRepository} from "typeorm";
import {User} from '../db/entities/User';
import {randomBytes, scrypt} from "crypto";
import * as jwt from "jsonwebtoken";

const config = require("../../config.json");

async function hash(password) : Promise<string>{
    return new Promise<string>((resolve, reject)  => {
        const salt = randomBytes(8).toString("hex")

        scrypt(password, salt, 64, (err, derivedKey) => {
            if (err) reject(err);
            resolve(salt + ":" + derivedKey.toString('hex'))
        });
    })
}

async function verify(password, hash) {
    return new Promise((resolve, reject) => {
        const [salt, key] = hash.split(":")
        scrypt(password, salt, 64, (err, derivedKey) => {
            if (err) reject(err);
            resolve(key == derivedKey.toString('hex'))
        });
    })
}


export async function login(request: Request, response: Response) {
    let body = request.body;
    getRepository(User).findOne({email: body.email}).then(user => {
        if (user) {
            verify(body.password, user.password).then(result => {
                if (result) {
                    const payload = {
                        id: user.id,
                        email: user.email,
                        firstname: user.firstname,
                        lastname: user.lastname
                    }
                    const token = jwt.sign(payload, config.secret)
                    response.send({token: token})
                } else {
                    response.send({error: "wrong password"})
                }
            })
        }

    }).catch(error => {
        if (error) {
            response.send({error: "email not found"})
        }
    });
}

export async function register(request: Request, response: Response) {
    let body = request.body;
    const userRepository = getRepository(User);
    userRepository.findOne({email: body.email}).then(user => {
        if (user){
            response.send({error: "Email is already in use"});
        } else {
            hash(body.password).then(hash => {
                    const newUser = new User(body.email, hash, body.firstname, body.lastname)
                    user = userRepository.create(newUser)
                    userRepository.save(user)
                response.send({success: ""});
            })
        }
    }).catch(error => {
        if (error) {
            response.send({error: "email not found"})
        }
    });
}