import * as api from './SlackApi';
import * as Messages from './Messages';

export function help(message) {
    console.log('helpコマンド実行');
    api.deleteMessage(message.channel_id, message.ts);

    api.postEphemeral(message.channel_id, Messages.help(), message.user_id);
}