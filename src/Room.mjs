import * as database from './Database';
import * as api from './SlackApi';
import * as Messages from './Messages';

let stayingNamesForHours = new Set();

// 発言場所がroom_nameチャンネルならtrue, そうじゃないならfalse
function prepare(message, cb) {
    api.getChannelName(message.channel_id, function (channelName) {
        if (channelName !== process.env.room_name)
            cb(false);
        else
            cb(true);
    });
}

export function login(message) {
    console.log('loginコマンド実行');

    prepare(message, function (judge) {
        if (judge) {
            let id = message.user_id;
            api.getUserInfo(id, function (user) {
                let name = user.display_name || user.real_name;
                database.login(id, name, function (result) {
                    if (result)
                        api.postMessage(message.channel_id, `<@${id}> ${Messages.login()}`);
                    else {
                        // slackから直接コマンド入力したなら
                        if (message.ts !== undefined)
                            api.deleteMessage(message.channel_id, message.ts);
                        api.postEphemeral(message.channel_id, `<@${id}> ${Messages.already_login()}`, message.user_id);
                    }
                });
            });
        }
    });
}

export function logout(message) {
    console.log('logoutコマンド実行');

    prepare(message, function (judge) {
        if (judge) {
            let id = message.user_id;
            database.logout(id, function (result) {
                if (result)
                    api.postMessage(message.channel_id, `<@${id}> ${Messages.logout()}`);
                else {
                    // slackから直接コマンド入力したなら
                    if (message.ts !== undefined)
                        api.deleteMessage(message.channel_id, message.ts);
                    api.postEphemeral(message.channel_id, `<@${id}> ${Messages.already_logout()}`, message.user_id);
                }
            });
        }
    });
}

export function stay(message) {
    console.log('stayコマンド実行');
    api.deleteMessage(message.channel_id, message.ts);

    prepare(message, function (judge) {
        if (judge) {
            database.getRoom(function (ids, names) {
                let num = ids.length;
                let list = `【現在${num}人】\n`;
                if (num === 0) {
                    list += Messages.none_peopele();
                } else {
                    for (let i = 0; i < num; i++) {
                        list += `${names[i]}\n`;
                    }
                }
                api.postEphemeral(message.channel_id, list, message.user_id);
            });
        }
    });
}

export function update(ids, names) {
    names.forEach(function (name) {
        stayingNamesForHours.add(name);
    });
    database.updateStayingUsers(ids, names);
}

export function notificatePerHours() {
    console.log('notificatePerHoursコマンド実行');

    let beforeHour = new Date(new Date().setHours(new Date().getHours() - 1)).getHours();
    let num = stayingNamesForHours.size;
    let list = `【${beforeHour}時台に在室した人数 ${num}人】\n`;
    if (num > 0) {
        stayingNamesForHours.forEach(function (name) {
            list += `${name}\n`;
        });
        api.postMessage(process.env.room_id, list);
    } else {
        list += Messages.none_peopele();
        api.postMessage(process.env.room_id, list);
    }

    // リセットする
    stayingNamesForHours = new Set();
}