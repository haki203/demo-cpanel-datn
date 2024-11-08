var createError = require('http-errors');
var express = require('express');
var path = require('path');
const { PeerServer } = require('peer');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const mongoose = require('mongoose');
require('./components/products/ProductModel');
var indexRouter = require('./routes/index');
var downloadApk = require('./routes/download');
var usersRouter = require('./routes/users');
const productApiRouter = require('./routes/api/ProductAPI');
const userApiRouter = require('./routes/api/UserAPI');
const productCpanelRouter = require('./routes/cpanel/ProductCPanel');
const userCpanelRouter = require('./routes/cpanel/UserCpanel');
const cors = require('cors');
const app = express();
const firebaseConfig = {
  apiKey: "AIzaSyAyhWnSyHSvXHnKEGzUemayimWlpLQfo7I",
  authDomain: "bookapp-f06b4.firebaseapp.com",
  projectId: "bookapp-f06b4",
  storageBucket: "bookapp-f06b4.appspot.com",
  messagingSenderId: "739672106128",
  appId: "1:739672106128:web:5186d4b6889378d25aa415"
};
const peerServer = PeerServer({ port: 8446, path: '/myapp' });

peerServer.on('connection', (client) => {
  console.log(`Client connected: ${client.id}`);
});

peerServer.on('disconnect', (client) => {
  console.log(`Client disconnected: ${client.id}`);
});

setTimeout(() => {
  console.log('PeerJS server is running on Port ', 8446, ' and ', peerServer);
}, 1000)

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'iloveyou',
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false }
}));
//
mongoose.connect('mongodb+srv://xuong:844666@cluster0.0urhouz.mongodb.net/datn', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})


  .then(() => console.log('>>>>>>>>>> DB Connected!!!!!!'))
  .catch(err => console.log('>>>>>>>>> DB Error: ', err));
app.use(cors());
app.use('/', indexRouter);
app.use('/download', downloadApk);
app.use('/users', usersRouter);
app.use('/api/user', userApiRouter);
app.use('/api/product', productApiRouter);
app.use('/cpanel/user', userCpanelRouter);
app.use('/cpanel/product', productCpanelRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

/**
 * CSDL           MONGO
 * Database     -- Database
 * table           collection
 * row              document
 * column         field
 */