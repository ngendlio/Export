var express = require('express'),
    config= require('./config');

module.exports =function() {
  //Setup configuration
  var app =express();
  //les inputs
  var bodyParser = require('body-parser'),
      expressValidator =require('express-validator'),
      cookieParser = require('cookie-parser'),
      logger= require('morgan'), // used for logging
      expressSession = require('express-session'), // used for managing server-side sessions
        /* For storing session it is recommend to use memorycached or Redis  */

        // redis= require("redis"),// to store 
        // RedisStore = require('connect-redis')(expressSession),//for storing our session DATA

      mongoose =require('mongoose'),  // ORM MongoDB
      favicon = require('serve-favicon'), //used to serve the fav icon
      passport = require('passport'); // Used to setup an authentication Strategy. 

// Connect first sur HUMMONGOUS(MongoDB)
  mongoose.connect(config.mongo.url);
  var db = mongoose.connection;

  db.on('error',function(error){
     console.log('ERROR DB'+error);
  })
  db.once('open', function() {
    console.log('Connected to mongo !');

  })

  app.set('views','./app/views');
  app.set('view engine', 'jade');
  app.locals.pretty = true;
  app.use(express.static('./public', { maxAge: 60*60 })); // For  CSS et images...,specify cache limit in time
  app.use(favicon('./public/favicon.ico'));

  app.use(logger('dev'));
  app.use(bodyParser.json()); // support json encoded bodies
  app.use(bodyParser.urlencoded({extended:false})); // support encoded bodies
  app.use(expressValidator()); 
  app.use(cookieParser('3CCC4ACD-6ED1-484ddd4-9217-82131BDCB239'));

  var cookieExpiration = new Date()
  cookieExpiration.setDate(cookieExpiration.getDate() + 1)
  // Here we should use redis for storing sessions

  app.use(expressSession({
    // store: new RedisStore({ 
    //   host: config.redis.host,
    //   port: config.redis.port,
    //   ttl : config.redis.ttl,
    //   pass:config.redis.pass,
    //   prefix:'ExportPic: ',
    // }),
    // enable secure when it is req.protocol=HTTPS
    // il fo faire maxAge suffissant pr eviter le renouvellemnt du csrf rapidement
    secret: '2C44124A-D649-4D44-9535-46E296EF984F', // a long ranndomn text
    cookie: {expires:cookieExpiration},//    add secure: true here 30 minutes
    httpOnly: true,
    resave: false,
    saveUninitialized: false,
    proxy:false,
    name : 'unknown_server' // Never broadcast your Web server type, now simulate PHP: 
  }));
 
  // load passport module
  require('./passport')(passport);
  app.use(passport.initialize());
  app.use(passport.session()); // persistent login sessions

  // load security module
  require('./Thesecurity')(app);
  // routes
  require('../app/routes/route.js')(app,passport);
  // load errorHandler variable
  app.use(require('./env').errorHandler);

   return app;
}
