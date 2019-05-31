var server = require("./server.js"); //要改(通用的)
var app = require("./songApp.js");	//每個應用程式專用
//index.html
//songInsert
//songDelete





//把可能發生的路徑寫一寫
server.route("/",app.index);
server.route("/index",app.index);
server.route("/index.html",app.index);
server.route("/songInsert",app.songInsert);
server.route("/songDelete",app.songDelete);


var port = (process.argv.length >2) ? process.argv[2]:80;
server.start(port);
