var express       = require('express');
var morgan        = require('morgan');
var bodyParser    = require('body-parser');
var session       = require('express-session');
var SessionStore  = require('express-sql-session')(session);
var http          = require('http');

// initialize express
var app = express();
var server = http.Server(app);

// Dev logging
if (process.isDev()) {
  app.use(morgan('dev'));
}

// Sessions
var storeOptions = {
  client: process.env.dbClient,
  connection: {
    host: process.env.dbHost,
    user: process.env.dbUser,
    password: process.env.dbPassword,
    database: process.env.dbDatabase,
    charset: 'utf8'
  },
  table: 'sessions',
  expires: 365 * 24 * 60 * 60 * 1000
};

var sessionStore = new SessionStore(storeOptions);

var sessionOptions = {
  key: process.env.sessionKey,
  secret: process.env.sessionSecret,
  store: sessionStore,
  resave: false,
  saveUninitialized: true
};

app.use(session(sessionOptions));

var passport = require('./passport')(app);

// JSON support for body parsing
app.use(bodyParser.json());

// Body parser
app.use(bodyParser.urlencoded({
  extended: true
}));

// Initialize the routes
require('./routes')(app, express);

if (process.isDev()) {
  server.listen(process.env.portDev);
} else {
  server.listen(process.env.port);
}

// Export Express
module.exports = app;