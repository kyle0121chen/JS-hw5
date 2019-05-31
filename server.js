var http = require('http');
var url = require('url');
var fs = require("fs");
var qs = require("querystring");
var formidable = require('formidable');


var root =".";

var handle = [];



module.exports.route = function (path, callback){
	handle[path] = callback;
	handle["songInsert"] = callback;  //其實就是從外面傳進來的app.sonInsert
}
module.exports.start = function (port=80){
	http.createServer(function (request, response){
		var query = "";
		if(request.method == 'POST'){
			var form = new formidable.IncomingForm();
			form.parse(request, function(err, query, files) {
				if(files.songFile.name == ''){
					response.writeHead(200, {'Content-Type': 'text/html'});
					response.write('File not found!');
					response.end();
				}
				else{
					console.log(files);
					console.log(files.songFile.path);
					
					main(request, response, query, files);
				}
				
				
				
			});
		}
		else { //GET
			
			query = qs.parse(url.parse(request.url).query);
			console.log("GET!! ");
			main(request,response,query);
		}
	}).listen(port, '0.0.0.0', function(){
		console.log('HTTP listening at http://%s:%s', this.address().address, this.address().port);
	});
}

function main(request, response, query, files){
	console.log(query,' MAIN');
	var pathname = url.parse(request.url).pathname;
	console.log('pathname = ',pathname);
	

	if (typeof(handle[pathname]) == "function" ){
		handle[pathname](request,response,query,files);//?????}
	} 
	else{
		console.log('Request received' + pathname);
		fs.createReadStream(root + pathname)	
		.on("error", function(e){
			console.log("Error: %s",e);
			if(e.code === 'ENOENT'){
				response.writeHead(200, {'Content-Type': 'text/html'});
				response.write(pathname + 'File not found!');
				response.end();


			}
			else{
				throw e;
			}
		})
		.pipe(response);
	}
	
	



};