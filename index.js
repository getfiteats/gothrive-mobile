var express = require('express')
var app = express();
var staticDir = '/www';

if (process.env.NODE_ENV === "development") {
  staticDir = '/build'
}

app.set('port', (process.env.PORT || 8081));

app.use(express.static(__dirname + staticDir));

app.get('.status', function(req, res) {
  res.send(200)
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
});