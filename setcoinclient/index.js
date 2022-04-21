var express = require('express');
var app = express();

const port = '7304';

app.use('/', express.static('WebContent'));

app.get('/', function (req, res) {
	res.render('index.html');
});

app.listen(port, () => {
  console.log('Express is listening on port', port);
});
