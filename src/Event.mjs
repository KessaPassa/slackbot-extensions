import * as api from './SlackApi';
import * as Messages from "./Messages";


export function channel_created(channel_id) {
    console.log('channel_createdコマンド実行');
    api.postMessage(process.env.GENERAL_CAHNNEL_ID, `New public channel :point_right: <#${channel_id}>`)
}