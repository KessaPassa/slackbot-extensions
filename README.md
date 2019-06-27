# Summary
slack botの拡張機能スクリプト  
フレームワークなしで制作  
文中の{}で囲まれたモノは変数であり、自由に名付けて良い  
<br>

## 1. Timeline(分報)
・`#times_{your_name}` で呟いた会話が `#times_timeline` に流れる  
・twitterや公開自分用DMみたいなもの  
<br>

## 2. Memo(メモ)
・簡易的なメモを取れる  
・チャンネル毎に保存される  

botにメンションで  
`memo` で一覧表示  
`memo -a {message}` でメモ追加  
`memo -r {num}` で番号のメモを削除  
<br>


## 3. Room(在室管理)
・誰が居るのかをWi-Fiに繋げ、macアドレスで管理する  
・`room` チャンネルのみで動作する    

botにメンションで  
`stay` で在室一覧  
<br>


## 4. ETC(その他機能)  
・その他の便利機能  

botにメンションで  
`help` でREADMEページのURLを定時する  
`shuffle {title}[{name1}, {name2}, ... , {nameN}]` で配列の中身をシャッフルする  
<br>


