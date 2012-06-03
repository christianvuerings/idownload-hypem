var http = require('http-get');
var url = require('url');
var express = require('express');
var app = express.createServer(express.logger());
app.register('.html', require('jade'));
app.set('views', __dirname + '/views');
app.set('view options', { layout: false });

app.get('/', function(request, response) {
    response.render('index.html');
});

app.get('/exists', function(request, response) {
    var origin = (request.headers.origin || "*");

    response.writeHead(
        "200",
        "OK",
        {
            "access-control-allow-origin": origin,
            "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
            "access-control-allow-headers": "content-type, accept",
            "access-control-max-age": 10
        }
    );

    response.end('ok');
});

app.get('/download/:fileid', function(req, res) {

    var downloadUrl = req.params.fileid;
    var parsedURL = url.parse(downloadUrl, true);

    var options = {url: downloadUrl};

    var filename;
    if (parsedURL && parsedURL.query && parsedURL.query.filename) {
        filename = parsedURL.query.filename + '.mp3';
    } else {
        var splitting = downloadUrl.split('/');
        filename = splitting[splitting.length-1];
    }

    http.get(options, 'downloads/' + filename, function (error, result) {
        if (error) {
            console.error(error);
        } else {
            console.log('File downloaded at: ' + result.file);
        }
    });

    var origin = (req.headers.origin || "*");

    res.writeHead(
        "200",
        "OK",
        {
            "access-control-allow-origin": origin,
            "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
            "access-control-allow-headers": "content-type, accept",
            "access-control-max-age": 10000
        }
    );

    res.end();
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
    console.log("Listening on " + port);
});
