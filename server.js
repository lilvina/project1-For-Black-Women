// SERVER SIDE JAVASCRIPT

var express = require('express')
  app = express(),
  bodyParser = require('body-parser'),
  _=require('underscore'),
  mongoose = require('mongoose');

// tell app to use bodyParser middleware
app.use(bodyParser.urlencoded({extended: true}));

//connecting the css/js to the server.js
app.use(express.static(__dirname + '/public'));

// connecting the pauris to the model which is going to grab the information 
// from mongoose & bring it back from db
var Blog = require('./models/blog');

//this is going to send the html to the root
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

//connect to db called 
mongoose.connect('mongodb://localhost/Blog');



//this is /get route which will get all the data in the server
app.get('/blog', function (req, res) {
  Blog.find(function (err, blog) {
    res.json(blog);
  });
});

// LINES#QUERY
app.get('/api/blogs', function(req, res) {
 Blog.find().sort('-_id').exec(function(err, lines) {
   console.log(blog);
   res.json(blogs);
 });
});

// LINES#CREATE
app.post('/api/blog', function(req, res) {
 // SAVE LINE TO DB
 var blog = new Blog({
   text: req.body.text
 });

 blog.save(function(err, line) {
   console.log(blog);
   res.json(blogs);
 });
});

app.listen(process.env.PORT || 3000);