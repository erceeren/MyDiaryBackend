import {login, register} from "./controller/authentication";
import {search, addFriend, getFriends} from './controller/user';
import {getMessages, getUnReadMessages} from './controller/message';
import {addDiary, getFeeds, getMyDiaries, newDiary} from "./controller/diary";


// @ts-ignore
export let AppRoutes = [
    {
        path: "/login",
        method: "post",
        action: login
    },
    {
        path: "/register",
        method: "post",
        action: register
    },
    {
        path: "/searchUser",
        method: "post",
        action: search
    },
    {
        path: "/addFriend",
        method: "post",
        action: addFriend
    },
    {
        path: "/getFriends",
        method: "post",
        action: getFriends
    },
    {
        path: "/getMessages",
        method: "post",
        action: getMessages
    },
    {
        path: "/getUnread",
        method: "get",
        action: getUnReadMessages
    },
    {
        path: "/addDiary",
        method: "post",
        action: addDiary
    },
    {
        path: "/getFeeds",
        method: "get",
        action: getFeeds
    },
    {
        path: "/getMyDiaries",
        method: "get",
        action: getMyDiaries
    },
    {
        path: "/newDiary",
        method: "get",
        action: newDiary
    }
];