/*
    認証する時に最初にアクセスするURL。最初の一度のみ使用
    https://slack.com/oauth/authorize?client_id=309113407440.439541092320&scope=client
*/

import request from 'request';

export function oauth(code) {
    console.log('oauth.access');
    request.post({
        url: 'https://slack.com/api/oauth.access',
        form: {
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            code: code
        }
    }, function (err, res, body) {
        // console.log(JSON.parse(body));
        rtmStart();
    });
}

// Real Time Messageing API Start
function rtmStart() {
    request.get({
        // url: 'https://slack.com/api/rtm.start',
        url: 'https://slack.com/api/rtm.connect',
        qs: {
            token: process.env.access_token
        }
    }, function (err, res, body) {
        console.log('rtm.connect');
        // console.log(JSON.parse(body));
        let websocketURL = JSON.parse(body).url;
        socket(websocketURL);
    });
}

export function setup() {
    rtmStart();
}


import WebSocket from 'ws';

export function socket(url) {
    console.log(url);
    let ws = new WebSocket(url);

    ws.on('open', function () {
        console.log('Start WebSocket');
    });

    ws.on('message', function (data) {
        data = JSON.parse(data);
        // console.log(data);
        mainProcess(data);
    });
}


import {Message} from "./Type";

// ここがslackからデータを受け取るメイン処理
function mainProcess(data) {
    // 接続時にhelloが通るので
    if (data.type === 'hello')
        return;

    // ハウリングするのでbotには反応しない
    if (data.bot_id !== undefined)
        return;

    let type = data.type;
    if (type === 'message') {
        // subtypeを持っているmessage typeには反応しない
        if (data.subtype !== undefined)
            return;

        let text = data.text;
        let is_mention = text.match(/<@(.*)/);
        let mention_user = undefined;
        let mention_text = undefined;
        let file_id = data.files !== undefined ? data.files[0].id : undefined;

        if (is_mention) {
            let tmp = text.split('<@')[1];
            mention_user = tmp.split('> ')[0];
            mention_text = text.split('> ')[1];
        }

        let message = new Message(data.user, text, data.channel, data.ts, is_mention, mention_user, mention_text, file_id);
        switchProcess(message);
    }
}


import * as timelime from './Timeline';
import * as memo from './Memo';
import * as room from './Room';

// メンション有り無しやコマンドに応じた分岐処理
function switchProcess(message) {
    // botにメンションなら
    if (message.mention_user === process.env.BOT_ID) {

        // メモに追加
        if (message.mention_text.match(/add (.*)/i))
            memo.add(message);

        // 指定された番号のメモを削除
        else if (message.mention_text.match(/remove (\d+)/))
            memo.remove(message);

        // メモを表示
        else if (message.mention_text === 'memo')
            memo.memo(message);


        // loginする
        else if (message.mention_text === 'login')
            room.login(message);

        // logoutする
        else if (message.mention_text === 'logout')
            room.logout(message);

        // 現在の在室状況
        else if (message.mention_text === 'room')
            room.room(message);
    }

    // ファイルなら
    else if (message.file_id !== undefined)
        timelime.file(message);

    // 特定のコマンド以外の時に通す
    else
        timelime.chat(message);
}




