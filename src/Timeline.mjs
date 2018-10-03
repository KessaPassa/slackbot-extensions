import * as api from './SlackApi';
import * as Messages from './Messages';
import request from 'request';


// 規定通りならtrue, 何かがダメならfalse
function prepare(data, cb) {
    // チャンネル名
    api.getChannelName(data.channel_id, function (channel_name) {
        let matches = channel_name.match(/times_(.*)/);

        // timelineならread-onlyなので警告する
        if (channel_name === process.env.timeline_name) {
            api.postMessage(data.channel_id, Messages.cant_chat());
            cb(false);
        }
        // times系ならok
        else if (matches)
            cb(true);
        else
            cb(false);
    });
}


export function chat(message) {
    prepare(message, function (judge) {
        if (judge) {
            api.getMessagePermalink(message.channel_id, message.ts, function (permalink) {
                api.getUserInfo(message.user_id, function (user) {
                    api.getChannelName(message.channel_id, function (channel_name) {
                        api.sendTakeover(user, message.text, permalink, channel_name);
                        // api.sendQuotelink(user, message.text, permalink);
                    });
                });
            });
        }
    });
}

export function file(message) {
    prepare(message, function (judge) {
        if (judge) {
            api.getFilePermalink(message.file_id, function (permalink) {
                api.getUserInfo(message.user_id, function (user) {
                    api.sendTakeover(user, permalink, permalink, 'file');
                });
            });
        }
    });

}