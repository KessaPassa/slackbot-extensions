import * as database from './Database';

import * as settings from './UsersSettings';

settings.setup();


export function getInfo(req, res) {

    database.getRoom(function (ids, names) {
        if (!ids){
            res.json({error: 'none'});
            return;
        }

        // 在室してる人
        let inRoomUsers = [];
        for (let i = 0; i < ids.length; i++) {
            inRoomUsers.push(settings.getUserById(ids[i]).Name);
        }

        // 帰宅してる人
        let goBackUsers = settings.getOnlyNames();
        for (let i = 0; i < inRoomUsers.length; i++) {
            // inRoomにないなら
            let index = goBackUsers.indexOf(inRoomUsers[i]);
            console.log(index);
            if (index !== -1) {
                goBackUsers.splice(index, 1);
            }
        }

        let json = {
            in: inRoomUsers,
            out: goBackUsers
        };
        res.json(json);
    });
}

export function sendInfo(req, res) {
    let query = req.query;
    let user = settings.getUserByName(query.name);

    if (user !== undefined) {
        let status = '';
        if (query.status === '0') {
            status = '在室';
            database.login(user.Id, user.Name, function (result) {});
        }
        else if (query.status === '1') {
            status = '帰宅';
            database.logout(user.Id, user.Name, function (result) {});
        }
        else if (query.status === '2') {
            status = '一時退勤';
            database.logout(user.Id, user.Name, function (result) {});
        }
        else
            res.json({error: 'none status'});

        let json = {
            name: user.Name,
            status: status
        };
        res.json(json);
    }
    else
        res.json({error: 'none user'});
}


import * as bot from './SetupBot';

export function oauth(req, res){
    res.send('oauth setting is collect');

    let code = req.query.code;
    bot.oauth(code);
}