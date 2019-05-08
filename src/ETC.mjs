import * as api from './SlackApi';
import * as Messages from './Messages';

export function help(message) {
    console.log('helpコマンド実行');
    api.deleteMessage(message.channel_id, message.ts);

    api.postEphemeral(message.channel_id, Messages.help(), message.user_id);
}

export function shuffle(message) {
    console.log('shuffleコマンド実行');

    // 配列形式で正規表現
    let matches = message.text.match(/shuffle (.*)\[(.+)(,+(.+))*\]/);
    if (matches) {
        let title = matches[1].trim();
        let text = matches[2];

        // コンマで分割しながら文字列中の空白を除去
        let array = text.split(',').map(function (item) {
            return ' ' + item.trim();
        });

        // 配列をランダムソート
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let tmp = array[i];
            array[i] = array[j];
            array[j] = tmp;
        }

        let result = '';
        if (title)
            result = `*【${title}】のシャッフル結果*\n`;
        result += `${array.toString()}`;

        api.postMessage(message.channel_id, result);
    }
    else {
        api.postEphemeral(message.channel_id, Messages.wrong_arguments(), message.user_id);
    }
}