var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var db = mongoose.Connection;
mongoose.connect('mongodb://localhost/mongo',{useNewUrlParser: true, useUnifiedTopology: true});
var Book = require('./models/book');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var port = 8080;

var router = require('./routes')(app, Book);

var server = app.listen(port, () => {
    console.log("Express server has started on port " + port)
});
