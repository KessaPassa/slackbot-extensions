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

// 在室情報
app.get('/room/info', function (req, res) {
    console.log('room/info');
    res.header('Content-Type', 'text/plain;charset=utf-8');
    serverApi.getInfo(req, res);
});

// login, logout管理
app.get('/room/management', function (req, res) {
    console.log('room/management');
    res.header('Content-Type', 'text/plain;charset=utf-8');
    serverApi.sendInfo(req, res);
});

// EventAPI認証用
app.get('/events', function (req, res) {
    res.header('Content-Type', 'application/json');
    res.status(200);
    // res.json({challenge: 'ok'});
    res.send({
        'token': '1x4g2qeDx2G9TX4TG219NnIU',
        'challenge': res.challenge,
        'type': 'url_verification'
    });
    console.log(res.body);
    console.log(req.body);
    console.log('リクエスト');
    console.log(req.body);
    console.log('レスポンス');
    console.log(res.body);
});

// bot oauth認証用
app.get('/oauth', function (req, res) {
    console.log('oauth');
    res.header('Content-Type', 'text/plain;charset=utf-8');
    serverApi.oauth(req, res);
});


import schedule from 'node-schedule';
import * as room from './src/Room';

// 時限式で強制ログアウト
schedule.scheduleJob({
    hour: 0,
    minute: 0
}, function () {
    room.warning();
});