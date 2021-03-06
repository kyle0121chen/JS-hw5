// index.html index.js index.css favicon.ico
// songInsert
// songDelete
var fs=require("fs");
const SONGFILE = "song.txt";


module.exports.index = function(request, response){
	songRender(response,"Welcome");
	

}
module.exports.songInsert = function(request, response, query, files){
	var oldpath = files.filetoupload.path;
	var newpath = './' + files.filetoupload.name;
	fs.rename(oldpath, newpath, function(err) {
		if (err) throw err;
		//console.log("Upload successful");
		fs.appendFIleSync(SONGFILE, query["songName"]+","+files.songFile.name+"\n");
		songRender(response,"Upload successful");
	});
}
module.exports.songDelete = function(request, response, query, files){
	var str = fs.readFileSync(SONGFILE,'utf8');
	var lines = str.split('\n');
	fd = fs.openSync(SONGFILE, 'w');
	for (let i=0, count=0; i<lines.length; i++){
		console.log(lines);
		if (lines.length>1){
			if (count == query["no"]) {
				let song = lines.split(",");
				fs.unlink(song[1], function(err){
					if (err)	throw err;
					console.log(song[1] + '  deleted!');
				});
			}
			else{
				count++;
				fs.writeSync(fd, lines[i]+"\n");
			}
		}
	}
	fs.closeSync(fd);
	songRender(response,"delete successful");
}

var html = fs.readFileSync('song.html','utf8');


function songRender(response, message){
	var str = fs.readFileSync(SONGFILE,'utf8');
	var lines = str.split('\n');
	var line, content="";
	for (let i=0; i<lines.length; i++){
		line = lines[i].split(",");
		if (line.length>1){
			content += '<tr>'
				+ '<td>' + (i+1) + '</td>'
				+ '<td>' + line[0] + '</td>'
				+ '<td>' + line[1] + '</td>'
				+ '<td>'
				+ '<input name="btnPlay" type="button" value="播放" mp3file="' + line[i] + '">'
				//+ '<input type="button" onclick="okPlay(\'' +line[1]+'\')" value="播放">'
				+ '<a href="/songDelete?no=' + i + ' "> "刪除"</a>'
				+ '</td>'
				+ '</tr>';	
		}
		
	}
	
	response.writeHead(200, {
		'Content-Type': 'text/html; charset=utf-8;'
	});
	response.end(html.replace("{{content}}",message+content));
}

