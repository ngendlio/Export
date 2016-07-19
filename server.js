
var express_App = require('./config/express_app');
// Express_App is the instance of express preconfigured

var server = express_App(); 
var port =12016;

//launch the server
server.listen(port);

module.exports =server;

console.log('Check url: https://localhost:'+port);



