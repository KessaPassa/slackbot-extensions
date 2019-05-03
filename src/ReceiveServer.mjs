import * as room from './Room';

export function updateStayingUsers(req, res) {
    let query = req.query;
    console.log(query);

    let ids = query.ids;
    let names = query.names;
    room.update(ids, names);
}

import * as bot from './SetupBot';

export function oauth(req, res) {
    res.send('oauth setting is collect');

    let code = req.query.code;
    bot.oauth(code);
}