var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var shell = require('shelljs');

var routes = require('./routes/index');
var write = require('./routes/write');
var read = require('./routes/read');
var show = require('./routes/show');

var app = express();

// fun stuff
var fixUptime = shell.exec('uptime').output.split(" ");
app.locals.uptime = fixUptime[fixUptime.indexOf("days,")-1]+" days";
app.locals.nodeVersion = shell.exec('node -v');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', routes);
app.use('/write', write);
app.use('/read', read);
app.use('/show', show);

// If only one genre, force array of one element
function oneOrMoreGenres (genre) {
  if (typeof genre == 'string') {
    var arr = [];
    arr.push(genre);
    return arr;
  } else {
    return genre;
  }
}

// Write movie to file
var filePath = __dirname + '/public/data.json';
var obj;
app.post('/write', function(req, res, next) {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) throw err
    obj = JSON.parse(data);
    var newMovie = {
      "title": req.body.title,
      "imdbRating": req.body.imdbRating,
      "plot": req.body.plot,
      "director": req.body.director,
      "movieLength": req.body.movieLength,
      "genre": oneOrMoreGenres(req.body.genre),
      "image": req.body.image
    };
    obj.film.push(newMovie);
    var send = JSON.stringify(obj,null,"\t");
    fs.writeFile(filePath, send, function(err) {
      if (err) throw err;
      res.render('write', { movieAdd: true });
      console.log("File saved");
    });
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.locals.pretty = true;
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
