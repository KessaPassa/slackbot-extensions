import * as database from './Database';
import * as api from './SlackApi';
import * as Messages from './Messages';


// 発言場所がroom_nameチャンネルならtrue, そうじゃないならfalse
function prepare(message, cb){
    api.getChannelName(message.channel_id, function (channelName) {
        if (channelName !== process.env.room_name)
            cb(false);
        else
            cb(true);
    });
}

export function login(message) {
    prepare(message, function (judge) {
        if (judge){
            let id = message.user_id;
            api.getUserInfo(id, function (user) {
                let name = user.display_name || user.real_name;
                database.login(id, name, function (result) {
                    if (result)
                        api.postMessage(message.channel_id, `<@${id}> ${Messages.login()}`);
                    else{
                        api.deleteMessage(message.channel_id, message.ts);
                        api.postEphemeral(message.channel_id, `<@${id}> ${Messages.already_login()}`, message.user_id);
                    }
                });
            });
        }
    });
}

export function logout(message) {
    prepare(message, function (judge) {
        if (judge) {
            let id = message.user_id;
            database.logout(id, function (result) {
                if (result)
                    api.postMessage(message.channel_id, `<@${id}> ${Messages.logout()}`);
                else{
                    api.deleteMessage(message.channel_id, message.ts);
                    api.postEphemeral(message.channel_id, `<@${id}> ${Messages.already_logout()}`, message.user_id);
                }
            });
        }
    });
}

export function room(message) {
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

export function forceLogout(){
    database.forceLogout(function (names) {
        console.log(`強制ログアウト, 数: ${names.length}`);
        if (names.length !== 0) {
            let list = Messages.force_logout() + '\n';
            for (let i=0; i<names.length; i++){
                list += `${names[i]}\n`;
            }
            api.postMessage(process.env.room_id, list);
        }
    });
}