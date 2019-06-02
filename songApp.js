// index.html index.js index.css favicon.ico
// songInsert
// songDelete
var fs=require("fs");
const SONGFILE = "song.txt";


module.exports.index = function(request, response){
	songRender(response,"Welcome");
	

}
module.exports.songInsert = function(request, response, query, files){

	if(files == undefined){
		songRender(response,"No input file!");
	}
	else{
		var oldpath = files.songFile.path;
		var newpath = './play/' + files.songFile.name;
		fs.rename(oldpath, newpath, function(err) {
			if (err) throw err;
			fs.appendFileSync(SONGFILE, query["songName"]+","+files.songFile.name+"\n");
			songRender(response,"Upload successful");
		});
	}
	
}
module.exports.songDelete = function(request, response, query, files){
	var str = fs.readFileSync(SONGFILE,'utf8');
	var lines = str.split('\n');
	fd = fs.openSync(SONGFILE, 'w');
	for (let i=0, count=0; i<lines.length; i++){
		console.log(lines);
		if (lines.length>1){
			if (i == query["no"]) {
				let song = lines[i].split(",");
				console.log("lines[i] == ",lines[i], " song == ",song, "i == ",i);
				var del_path= "./play/"+song[1];
				fs.unlink(del_path, function(err){
					if (err)	console.log(err);
					console.log(song[1] + '  deleted!');
				});
			}
			else{
				
				if(count < lines.length-2){
					console.log("Count,  i. ===. ", count,i);
					fs.writeSync(fd, lines[i]+"\n");	
				}
				count++;
				
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
				+ '<input name="btnPlay" class="butCSS" type="button" value="播放" onclick="btnPlay(\''+ line[1]+ '\')">'
				+'<input type ="button" class="butCSS" onclick="javascript:location.href=\'/songDelete?no=' +i + '\'"value="刪除"></input>'
				+ '</td>'
				+ '</tr>';	
		}
		
	}
	
	response.writeHead(200, {
		'Content-Type': 'text/html; charset=utf-8;'
	});
	response.end(html.replace("{{content}}",message+content));
}

