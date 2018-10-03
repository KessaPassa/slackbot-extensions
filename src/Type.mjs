const _id = Symbol();
const _name = Symbol();

export class User{
    constructor(id, name){
        // this.id = id;
        // this.name = name;
        this[_id] = id;
        this[_name] = name;
    }

    get Id(){
        return this[_id];
    }

    get Name(){
        return this[_name];
    }
}


const _user_id_message = Symbol();
const _text_message = Symbol();
const _channel_id_message = Symbol();
const _ts_message = Symbol();
const _is_mention_message = Symbol();
const _mentionUser_message = Symbol();
const _mentionText_message = Symbol();
const _file_id = Symbol();

export class Message{
    constructor(user_id, text, channel_id, ts, is_mention, mention_user, mention_text, file_id){
        this[_user_id_message] = user_id;
        this[_text_message] = text;
        this[_channel_id_message] = channel_id;
        this[_ts_message] = ts;
        this[_is_mention_message] = is_mention;
        this[_mentionUser_message] = mention_user;
        this[_mentionText_message] = mention_text;
        this[_file_id] = file_id;
    }

    get user_id(){
        return this[_user_id_message];
    }

    get text(){
        return this[_text_message];
    }

    get channel_id(){
        return this[_channel_id_message];
    }

    get ts(){
        return this[_ts_message];
    }

    get is_mention(){
        return this[_is_mention_message];
    }

    get mention_user(){
        return this[_mentionUser_message];
    }

    get mention_text(){
        return this[_mentionText_message];
    }

    get file_id(){
        return this[_file_id];
    }
}


// const _user_id_file = Symbol();
// const _file_id_file = Symbol();
//
// export class File{
//     constructor(user_id, file_id){
//         this[_user_id_file] = user_id;
//         this[_file_id_file] = file_id;
//     }
//
//     get user_id(){
//         return this[_user_id_file];
//     }
//
//     get file_id(){
//         return this[_file_id_file];
//     }
// }