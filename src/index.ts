import "reflect-metadata";
import {createConnection} from "typeorm";
import {Request, Response} from "express";
import * as express from "express";
import * as bodyParser from "body-parser";
import {AppRoutes} from "./routes";
import * as cors from 'cors';
//import  as WebSocket from 'ws';
import * as socketIo from 'socket.io';
import * as http from 'http';
import DiarySocket from "./DiarySocket";

createConnection().then(async _ => {

    // create express app
    const app = express();
    app.use(bodyParser.json());

    app.use(
        cors({
            origin: [/.*localhost.*/]
        })
    );
    app.options("*", cors());

    // register all application routes
    AppRoutes.forEach(route => {
        app[route.method](route.path, (request: Request, response: Response, next: Function) => {
            route.action(request, response)
                .then(() => next)
                .catch(err => next(err));
        });
    });

    // run app

    const server = http.createServer(app);
    // @ts-ignore
    const io = socketIo(server, {cors: "*"})

    io.on('connection', (socket: socketIo.Socket) => {
        new DiarySocket(socket)
    })

    server.listen(8000);



}).catch(error => console.log("TypeORM connection error: ", error));

