import * as database from './Database';
import * as api from './SlackApi';
import * as Messages from './Messages';


export function add(message) {
    api.deleteMessage(message.channel_id, message.ts);

    let matches = message.text.match(/add (.*)/i);
    if (matches) {
        // 改行しても記録できる
        let text = message.text.split('add ')[1];
        console.log(text);

        api.getChannelName(message.channel_id, function (channel_name) {
            database.add(message.channel_id, channel_name, text, function (result) {
                api.postEphemeral(message.channel_id, Messages.add(), message.user_id);
            });
        });
    }
}

export function remove(message) {
    api.deleteMessage(message.channel_id, message.ts);

    let matches = message.text.match(/remove (\d+)/);
    if (matches) {
        let num = matches[1];

        api.getChannelName(message.channel_id, function (channel_name) {
            database.remove(message.channel_id, channel_name, num, function (result) {
                let content = '';
                if (result == null)
                    content = Messages.cant_data();
                else if (result === -1)
                    content = Messages.cant_remove();
                else
                    content = Messages.removed(num);

                api.postEphemeral(message.channel_id, content, message.user_id);
            });
        });
    }
}

export function memo(message) {
    api.deleteMessage(message.channel_id, message.ts, 2 * 60 * 1000);

    database.getChannels(message.channel_id, function (text_array) {
        // メモがない時
        if (text_array == null) {
            api.postEphemeral(message.channel_id, Messages.none_memo(), message.user_id);
            return;
        }

        let text = '';
        for (let i = 0; i < text_array.length; i++) {
            if (i === 0)
                text += `${text_array[i]}\n`;
            else
                text += `${i}. ${text_array[i]}\n`;
        }
        api.postEphemeral(message.channel_id, text, message.user_id);
    });
}