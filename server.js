var express = require('express');

var app = express.createServer(express.logger());
app.register('.html', require('jade'));
app.set('views', __dirname + '/views');
app.set('view options', { layout: false });

app.get('/', function(request, response) {
    response.render('index.html');
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
    console.log("Listening on " + port);
});
