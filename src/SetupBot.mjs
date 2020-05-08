/*
    認証する時に最初にアクセスするURL。最初の一度のみ使用
    https://slack.com/oauth/authorize?client_id=309113407440.439541092320&scope=client
*/

import request from 'request';

const root_url = 'https://slack.com/api/';


export function oauth(code) {
    request.post({
        url: root_url + 'oauth.access',
        form: {
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            code: code
        }
    }, function (err, res, body) {
        console.log('oauth.access');
        // console.log(JSON.parse(body));
        rtmStart();
    });
}

// Real Time Messageing API Start
function rtmStart() {
    let rtm = 'rtm.start';
    // let rtm = 'rtm.connect';
    request.get({
        url: root_url + rtm,
        qs: {
            token: process.env.token
        }
    }, function (err, res, body) {
        console.log(rtm);
        console.log(JSON.parse(body));
        let websocketURL = JSON.parse(body).url;
        socket(websocketURL);
    });
}

export function setup() {
    rtmStart();
}


import WebSocket from 'ws';

let ws = null;

export function socket(url) {
    console.log(url);
    ws = new WebSocket(url);

    ws.on('open', function () {
        console.log('Open WebSocket');
    });

    ws.on('message', function (data) {
        data = JSON.parse(data);
        // console.log(data);
        mainProcess(data);
    });

    ws.on('close', function (data) {
        console.log('Close WebSocket');
        // 3病後に再起動
        // setTimeout(setup(), 3000);
    });
}

export function reboot() {
    if (ws !== null) {
        ws.close();
        ws = null;
        rtmStart();
    }
}


import {Message} from "./Type";
import * as event from './Event';

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
    // Event API
    else {
        if (type === 'channel_created')
            event.channel_created(data.channel.id)
    }
}


import * as timelime from './Timeline';
import * as memo from './Memo';
import * as room from './Room';
import * as etc from './ETC';

// メンション有り無しやコマンドに応じた分岐処理
function switchProcess(message) {
    // botにメンションなら
    if (message.mention_user === process.env.BOT_ID) {

        if (message.mention_text === 'room message stop')
            room.stopMessage(message);
        else if (message.mention_text === 'room message start')
            room.startMessage(message);

        // 説明書を表示
        else if (message.mention_text === 'help')
            etc.help(message);

        // シャッフルする
        else if (message.mention_text.match(/shuffle/))
            etc.shuffle(message);

        // メモ
        else if (message.mention_text.match(/memo/))
            memo.switchProcess(message);

        // 現在の在室状況
        else if (message.mention_text === 'stay')
            room.stay(message);
    }

    // ファイルなら
    else if (message.file_id !== undefined)
        timelime.file(message);

    // 特定のコマンド以外の時に通す
    else
        timelime.chat(message);
}




