const express = require('express');
const app = express();
const http    = require('http');
const bodyparser = require('body-parser');
const ejs = require('ejs');
const morgan  = require('morgan');
const config  = require('./config/server.json');
var main    = require('./routes/page');

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:false}));

app.use(morgan('short'));
app.use('/main',main);

app.use(express.static('public'));



app.set('views',__dirname + '/views');
app.set('view engine','html');
app.engine('html',ejs.renderFile);



const port = normalizePort(process.env.PORT || config.WEBSERVER_PORT);

function normalizePort(val) {
    var port = parseInt(val, 10);
  
    if (isNaN(port)) {
      // named pipe
      return val;
    }
  
    if (port >= 0) {
      // port number
      return port;
    }
  
    return false;
}


function onError(error) {
  if (error.syscall !== 'listen') {
      throw error;
  }

  var bind = typeof port === 'string' ?
      'Pipe ' + port :
      'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
      case 'EACCES':
          //console.error(bind + ' requires elevated privileges');
          console.log(bind + ' requires elevated privileges');
          process.exit(1);
          break;
      case 'EADDRINUSE':
          //console.error(bind + ' is already in use');
          console.log(bind + ' is already in use');
          process.exit(1);
          break;
      default:
          throw error;
  }
}  

function Work(){
  let server = http.createServer(app);
  server.listen(port, () => {
    console.log('Panchange Client listening on port', port)
  });
  server.on('error', onError);
  /*
  server.on('error', onError);
  server.on('listening', onListening);
  process.on("uncaughtException", function($err) {
    console.log("Error occured : " + $err.stack);
  });

  function onListening() {
      var addr = server.address();
      var bind = typeof addr === 'string' ?
          'pipe ' + addr :
          'port ' + addr.port;  
      console.log('PanChangeClientServer Start port: ' + addr.port+' id('+cluster.worker.id+')');
  } */

}

Work();

/* 
if(cluster.isMaster){
  for (var i = 0; i < numCPU; i++) {        
    cluster.fork();
  }
  cluster.on("death", function(worker) {
      console.log("Worker Death " + worker.pid + " died. restart...");
      cluster.fork();
  });

  cluster.on("exit", function(worker) {
      console.log("Worker Exit " + worker.pid + " exied. restart...");
      cluster.fork();
  });
}else{
  Work();
}
*/




