import dotenv from 'dotenv';

dotenv.config();

// データベース
import * as database from './src/Database';

database.setup();
import * as serverApi from "./src/ReceiveServer";


// APIサーバ機能
import express from "express";
import bodyParser from 'body-parser';

const app = express();
app.set('port', (process.env.PORT || 8000));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// postだと上手く動作しない

import * as bot from './src/SetupBot';

bot.setup();

// Run Server
app.listen(app.get('port'), function () {
    console.log('server launched');
});

// ルートページ
app.get('/', function (req, res) {
    res.header('Content-Type', 'text/plain;charset=utf-8');
    res.status(200);
    res.send('Bot Rebooted');
    console.log('root page accessed');

    // botをrebootする
    // bot.setup();
    bot.reboot()
});

let isLocalAlive = false;
// ローカルサーバから得た在室情報をデータベースに反映
app.get('/room/update', function (req, res) {
    console.log('room/update');
    res.header('Content-Type', 'text/plain;charset=utf-8');
    res.status(200);
    res.send('recieved');
    serverApi.updateStayingUsers(req, res);
});

// EventAPI認証用
app.post('/events', function (req, res) {
    res.header('Content-Type', 'application/json');
    res.status(200);
    res.send({
        'token': req.body.token,
        'challenge': req.body.challenge,
        'type': 'url_verification'
    });
});

// bot oauth認証用
app.get('/oauth', function (req, res) {
    console.log('oauth');
    res.header('Content-Type', 'text/plain;charset=utf-8');
    serverApi.oauth(req, res);
});

import schedule from 'node-schedule';
import * as room from './src/Room';

// 1時間ごとに実行
schedule.scheduleJob({
    hour: [...Array(24).keys()],
    minute: 0
}, function () {
    room.notificatePerHours();
});