require('dotenv').config();
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');

var routerPredict = require('./src/router');

var app = express();
const port = 8000;

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/predict', routerPredict);

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
})