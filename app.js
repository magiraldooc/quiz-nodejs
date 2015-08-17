var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var methodOverride = require('method-override');
var session = require('express-session');
var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(partials());

//app.use(favicon(__dirname + 'public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser('quiz-nodejs'));
app.use(session());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

//Helpers dinámicos
app.use(function(req, res, next){
  if(!req.path.match(/\/login|\/logout/)){
    req.session.redir = req.path;
  }

  res.locals.session = req.session;
  next();
});

app.use(function(req, res, next){
  if(res.locals.session.lastTransaction){
    var horaActual = new Date();
    var horaSesion = Date.parse(req.session.lastTransaction);
    var diffTime = Math.abs(horaActual.getTime() - horaSesion);
    if(diffTime / 1000 > 60){
      delete req.session.user;
      delete req.session.lastTransaction;
      //Redirección al path anterior a login
      res.redirect(req.session.redir.toString());
    }else{
      req.session.lastTransaction = new Date();
    }
  }
  next();
});

app.use('/', routes);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            errors: []
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        errors: []
    });
});


module.exports = app;
