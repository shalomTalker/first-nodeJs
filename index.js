var url = require('url');
var http = require('http');
var fs = require('fs');

var jsonData = [];

function buildDynamicHtml(data) {
	var html = `
		<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<title>home</title>
		</head>
		<body>
		    ${data.map(obj => `
		    	<h1>User name:${obj.userName}</h1><br>
		    	<h2>Title:${obj.title}</h2>
		    	<ul>
			    	<h4>Notes:</h4>
			    	${obj.notes.map(note => `<li>${note}</li>`).join('')}
		    	</ul> `).join('')}
		</body>
		</html>
		`; 
	return html;
}

var server = http.createServer((req, res) => {
	var stringUrl = url.parse(req.url, true).pathname;
	switch (stringUrl) {
		case '/friend':
		fs.readFile('./HTMLnotes.json', {encoding: "utf-8"}, (err, data) => {
				if (err) {
					res.writeHead(404);
					res.end(err.code);
				} else {
					var o = JSON.parse(data)
					var html = buildDynamicHtml(o)
					// console.log(o)
					res.setHeader('Content-Type', 'text/html');
					res.write(html);
					res.end();
				}
			});
			break;

		case '/queries':
			var object = url.parse(req.url, true).query;
			// console.log(object)
			if (Object.keys(object).length !== 0) {
				jsonData.push(object);
			}
			fs.writeFile('myQueries.json', JSON.stringify(jsonData) , function (err) {
				if (err) throw err;
			});
			break;

		default: 
			res.setHeader('Content-Type', 'text/html');
			res.write('{"key": "value", "num": 5}');
			res.end();
	}

})
server.listen(3000, 'localhost')
