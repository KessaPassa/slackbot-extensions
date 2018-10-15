import * as api from './SlackApi';
import * as Messages from './Messages';

export function help(message) {
    api.postEphemeral(message.channel_id, Messages.help(), message.user_id);
}