import request from 'request';

const root_url = 'https://slack.com/api/';

// メッセージ削除
export function deleteMessage(channel, ts, time = 30 * 1000) {
    setTimeout(function () {
        request.post({
            url: root_url + 'chat.delete',
            form: {
                token: process.env.access_token,
                channel: channel,
                ts: ts,
                as_user: true
            }
        }, function (err, res, body) {
            if (err) throw err;
            // console.log('chat.delete');
            // console.log(JSON.parse(body));
        });
    }, time);
}

// ユーザ情報取得
export function getUserInfo(user_id, callback) {
    request.get({
        url: root_url + 'users.info',
        qs: {
            token: process.env.token,
            user: user_id
        }
    }, function (err, res, body) {
        if (err) throw err;
        callback(JSON.parse(body).user.profile);
    });
}

// チャンネルの名前取得
export function getChannelName(channel_id, callback) {
    request.get({
        url: root_url + 'channels.info',
        qs: {
            token: process.env.token,
            channel: channel_id
        }
    }, function (err, res, body) {
        if (err) throw err;
        callback('#' + JSON.parse(body).channel.name);
    });
}

// メッセージのリンク取得
export function getMessagePermalink(channel_id, ts, callback) {
    request.get({
        url: root_url + 'chat.getPermalink',
        qs: {
            token: process.env.token,
            channel: channel_id,
            message_ts: ts
        }
    }, function (err, res, body) {
        if (err) throw err;
        callback(JSON.parse(body).permalink);
    });
}


// ファイルのpermalink
export function getFilePermalink(file_id, callback) {
    request.post({
        url: root_url + 'files.sharedPublicURL',
        form: {
            token: process.env.access_token,
            file: file_id
        }
    }, function (err, res, body) {
        if (err) throw err;
        callback(JSON.parse(body).file.permalink);
    });
}

//乗っ取り形式
export function sendTakeover(user, text, permalink, channel_name) {
    let footer = permalink;
    if (!channel_name.match(/#(.*)/)) {
        footer = '';
    }

    request.post({
        url: root_url + 'chat.postMessage',
        form: {
            token: process.env.token,
            channel: process.env.timeline_id,
            text: text,
            icon_url: user.image_1024,
            username: (user.display_name || user.real_name) + (` (${channel_name})`),
            link_names: true,
            attachments: JSON.stringify([{
                text: '',
                footer: footer
            }])
        }
    }, function (err, res, body) {
        if (err) throw err;
        // console.log(JSON.parse(body));
    });
}

// 引用リンク形式
export function sendQuotelink(user, text, permalink) {
    request.post({
        url: root_url + 'chat.postMessage',
        form: {
            token: process.env.token,
            channel: process.env.timeline_id,
            text: permalink,
            link_names: true,
            attachments: JSON.stringify([{
                author_name: user.display_name,
                author_icon: user.image_1024,
                text: text
            }])
        }, function(err, res, body) {
            if (err) throw err;
            // console.log(JSON.parse(body));
        }
    });
}


// 普通にメッセージを送る
export function postMessage(channel, text, cb=null) {
    request.post({
        url: root_url + 'chat.postMessage',
        form: {
            token: process.env.token,
            channel: channel,
            text: text
        }
    }, function(err, res, body) {
        if (err) throw err;
        // console.log('chat.postMessage');
        // console.log(JSON.parse(body));

        if (cb)
            cb(JSON.parse(body));
    });
}


// 特定の人にしか見えないメッセージを送る
export function postEphemeral(channel, text, user) {
    request.post({
        url: root_url + 'chat.postEphemeral',
        form: {
            token: process.env.token,
            channel: channel,
            text: text,
            user: user
        }
    });
}