const url_readme = 'https://github.com/KessaPassa/slackbot-extensions/blob/master/README.md';

// -------- 内部用 --------

// エラー箇所を関数名で示す
export function error(function_name) {
    return 'error: ' + function_name;
}

// -------- End --------

// -------- botに喋らせる用(cv: エルフのえる) --------
export function header() {
    return 'える知ってるよ〜。';
}

// help
export function help() {
    return `えるの説明書だよ\n${url_readme}`;
}

//memo
export function list_header() {
    return '【ここのメモ帳だよ】';
}

export function add() {
    return 'メモを追加したよ';
}

export function none_memo() {
    return 'メモはないよ';
}

export function cant_data(num) {
    return `${num}番はデータがないんだよ`;
}

export function cant_remove(num) {
    return `${num}番は削除失敗したよ`;
}

export function removed(num) {
    return `${num}番のメモを削除したよ`;
}


// room
export function already_login() {
    return 'もうログインしてるよ';
}

export function login() {
    return 'いらっしゃ〜いだよ';
}

export function already_logout() {
    return 'もうログアウトしてるよ';
}

export function logout() {
    return 'お疲れ様だよ';
}

export function none_peopele() {
    return '誰もいないよ';
}

export function local_server_down() {
    return 'ローカルサーバが落ちてるよ';
}


// timeline
export function cant_chat() {
    return 'ここで喋っちゃダメなんだよ〜';
}

// Common
export function wrong_arguments() {
    return '引数が間違ってるよ';
}

// module.exports = class Messages {
//
//     // -------- 内部用 --------
//
//     // エラー箇所を関数名で示す
//     static error(function_name) {
//         return 'error: ' + function_name;
//     }
//
//     // -------- End --------
//
//     // -------- botに喋らせる用(cv: エルフのえる) --------
//     static getChannels header() {
//         return 'える知ってるよ〜。';
//     }
//
//     // add
//     static getChannels add() {
//         return 'メモを追加したよ';
//     }
//
//     //memo(Database)
//     static getChannels list_header() {
//         return '【ここのメモ帳だよ】';
//     }
//
//     // remove
//     static getChannels cant_data() {
//         return Messages.header() + 'データがないんだよ〜';
//     }
//
//     static getChannels cant_remove() {
//         return Messages.header() + 'その番号ないんだよ〜';
//     }
//
//     static removed(num) {
//         return `${num}番のメモを削除したよ`;
//     }
//
//     // Common
//     static getChannels wrong_arguments() {
//         return '引数が間違ってるよ〜';
//     }
//
//     // -------- End --------
//
//     // static getCallStack() {
//     // try {
//     //     throw new Error("DUMMY");
//     // } catch(e) {
//     //     return e.stack.split(/[\r\n]+/).filter(function(v,v2,v3){
//     //         return /^    at .*:[0-9]+:[0-9]+/.test(v);
//     //     });
//     // }
// }
