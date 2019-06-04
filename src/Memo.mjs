import * as database from './Database';
import * as api from './SlackApi';
import * as Messages from './Messages';


export function switchProcess(message) {
    const command = message.mention_text;

    if (command === 'memo') {
        memo(message);
        return;
    }

    // optionは一文字しか持たせない
    let matches = command.match(/memo -(\D) (.*)/);
    if (matches) {
        let option = matches[1];
        let content = matches[2];

        if (option === 'a')
            add(message, content);
        else if (option === 'r')
            remove(message, content);
        else
            noneOption(message);
    }
}

function memo(message) {
    console.log('memoコマンド実行');
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


function add(message, content) {
    console.log('addコマンド実行');
    api.deleteMessage(message.channel_id, message.ts);

    api.getChannelName(message.channel_id, function (channel_name) {
        database.add(message.channel_id, channel_name, content, function (result) {
            api.postEphemeral(message.channel_id, Messages.add(), message.user_id);
        });
    });
}

function remove(message, content) {
    console.log('removeコマンド実行');
    api.deleteMessage(message.channel_id, message.ts);

    // 数字なら
    let matches = content.match(/^(\d)(\s*)(,(\s*)?\d)*$/g);
    if (matches) {
        // コンマで分割しながら文字列中の空白を除去
        let array = content.split(',').map(function (item) {
            return item.trim();
        });

        // 削除すると番号が繰り下がるので逆順で処理する
        array.sort(
            function (a, b) {
                return (a < b ? 1 : -1);
            }
        );

        // To-Do 複数を指定すると一つしか消えないバグ
        api.getChannelName(message.channel_id, function (channel_name) {
            array.forEach(function (num) {
                database.remove(message.channel_id, channel_name, num, function (result) {
                    let content = '';
                    if (result == null)
                        content = Messages.cant_data(num);
                    else if (result === -1)
                        content = Messages.cant_remove(num);
                    else
                        content = Messages.removed(num) + `\n${result}`;

                    api.postEphemeral(message.channel_id, content, message.user_id);
                });
            });
        });
    } else {
        noneOption(message);
    }
}

function noneOption(message) {
    console.log('nonOptionコマンド実行');
    api.deleteMessage(message.channel_id, message.ts);
    api.postEphemeral(message.channel_id, Messages.wrong_arguments(), message.user_id);
}