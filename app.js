const createError = require('http-errors');
const express = require('express');
const engine = require('ejs-locals');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// database
const mongo = require('mongodb');
const monk = require('monk');
let db = monk('localhost:27017/captaincook');

// catch error connection to db
db.catch(function(err) {
  console.log(err)
});

// routers
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const ingredientsRouter = require('./components/ingredients/ingredients');
// end routers

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', engine);
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// Make our db accessible to our router
app.use(function(req,res,next){
    req.db = db;
    next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/ingredients', ingredientsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
