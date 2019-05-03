import * as database from './Database';
import * as api from './SlackApi';
import * as Messages from './Messages';
import {getRoom} from "./Database";


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

export function room(message) {
    console.log('roomコマンド実行');
    api.deleteMessage(message.channel_id, message.ts);

    prepare(message, function (judge) {
        if (judge) {
            database.getRoom(function (ids, names) {
                let num = ids.length;
                let list = `【現在の在室メンバー${num}人】\n`;
                if (num === 0) {
                    list += Messages.none_peopele();
                }
                else {
                    for (let i = 0; i < num; i++) {
                        list += `${names[i]}\n`;
                    }
                }
                api.postEphemeral(message.channel_id, list, message.user_id);
            });
        }
    });
}

// logoutしてない人用にメンションで警告を出す
export function warning() {
    console.log('warningコマンド実行');
    getRoom(function (ids, names) {
        if (ids != null && ids.length !== 0) {
            let list = Messages.warning() + '\n';
            for (let i = 0; i < ids.length; i++) {
                list += `<@${ids[i]}>\n`;
            }
            api.postMessage(process.env.room_id, list);
        }
        else
            api.postMessage(process.env.room_id, Messages.not_warning());
    });

}

// 廃止機能
export function forceLogout() {
    console.log('forceLogoutコマンド実行');
    database.forceLogout(function (ids) {
        console.log(`強制ログアウト, 数: ${ids.length}`);
        if (ids.length !== 0) {
            let list = Messages.force_logout() + '\n';
            for (let i = 0; i < ids.length; i++) {
                list += `<@${ids[i]}>\n`;
            }
            api.postMessage(process.env.room_id, list);
        }
    });
}