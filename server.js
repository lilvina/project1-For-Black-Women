// SERVER SIDE JAVASCRIPT

var express = require('express')
	app = express(),
	bodyParser = require('body-parser'),
	ejs = require('ejs'),
	_ = require('underscore'),
	mongoose = require('mongoose'),
	session = require('express-session'),
  Post = require('./models/post'),
  User = require('./models/user');

// middleware
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

// connect to mongodb
mongoose.connect(
	process.env.MONGOLAB_URI ||
	process.env.MONGOHQ_URL ||
	'mongodb://localhost/project1'
);


//pre-seeded post
var posts = [
    {
      id: 1,
      name: "Test 1,2,3",
      // comment: "Hello World"

    },

    {
      id: 2,
      name: "Let's go!",
      // comment: "Crazy"
    },

    {
      id: 3,
      name: "Yay!",
      // comment: "Goodbye!"
    }

];


  
// set session options
app.use(session({
  saveUninitialized: true,
  resave: true,
  secret: 'SuperSecretCookie',
  cookie: { maxAge: 60000 }
}));

// middleware to manage sessions
app.use('/', function (req, res, next) {
  // saves userId in session for logged-in user
  req.login = function (user) {
    req.session.userId = user.id;
  };

  // finds user currently logged in based on `session.userId`
  req.currentUser = function (callback) {
    User.findOne({_id: req.session.userId}, function (err, user) {
      req.user = user;
      callback(null, user);
    });
  };

  // destroy `session.userId` to log out user
  req.logout = function () {
    req.session.userId = null;
    req.user = null;
  };

  next();
});

// STATIC ROUTES

// homepage
app.get('/', function (req, res){
  res.sendFile(__dirname + '/public/views/index.html');
});

// profile page
app.get('/profile',function(req,res){
  req.currentUser(function (err, user){
    if (user){
      res.sendFile(__dirname + '/public/views/profile.html');
      // redirect if no user logged in
    } else {
      res.redirect('/');
    }
  });
  // res.send('got here');
});
// IS A FORM TO SIGNUP
app.get("/signup", function (req, res) {
	res.sendFile(__dirname + "/public/views/signup.html")
});

// SIGNs UP  A USER
app.post("/users", function (req, res) {
	// grab the new user out of the user params
	// provided by body-parser
	// var newUser = req.body.user;
  var email = req.body.post.email;
  var password = req.body.post.password;

	User.createSecure(email, password, function (err, user) {
		console.log(user);
		// req.login(user);
		res.redirect("/");
	});
});

// login a user
app.post("/login", function (req, res){
	var email = req.body.post.email;
  var password = req.body.post.password;

	User.authenticate(email, password, function (err, user){
		req.login(user);
    res.redirect("/profile");
	});
});

// log out a user
app.get('/logout', function (req, res){
  req.logout();
  res.redirect('/');
});


// signup route (renders signup view)
app.get('/index', function (req, res) {
  req.currentUser(function (err, user) {
    // check for current log in
    if (user) {
      res.sendFile(__dirname + '/project1/index.html');
    } else {
      res.redirect('/');
    }
  });
});


// log out user (destroy session)
app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

// API ROUTES

app.get('/api/posts', function (req, res){
  // find all posts in db
  Post.find(function (err, posts){
    res.json(posts);
  });
});

// create new post
app.post('/api/posts', function (req, res){
  //create new post with form data
  var newPost = new Post({
    description: req.body.description
    // postedBy: req.body.postedBy,
    // dateCreated: req.body.dateCreated,
    // comments: req.body.comments
  });

  newPost.save(function (err, savedPost){
    res.json(savedPost);
  });
  // res.send("Hello World");
});

// get one post
app.get('/api/posts/:id', function (req,res){
  // set the value of the id
  var targetId = req.params.id;

  // find post in db by id
  Post.findOne({_id: targetId}, function (err, foundPost){
    res.json(foundPost);
  });
});

// update phrase
// app.put('/api/posts/:id', function (req, res) {
//   // set the value of the id
//   var targetId = req.params.id;

//   // find post in db by id
//   Post.findById({_id: targetId}, function (err, foundPost) {
//     // update the post
//     foundPost.description = req.body.description;
//     // foundPost.postedBy = req.body.postedBy;
//     // foundPost.dateCreated = req.body.dateCreated;
//     // foundPost.comments = req.body.comments

//     // save updated post in db
//     foundPost.save(function (err, savedPost) {
//       res.json(savedPost);
//     });
//   });
// });


// // delete post
// app.delete('/api/posts/:id', function (req, res) {
//   // set the value of the id
//   var targetId = req.params.id;

//   // find phrase in db by id and remove
//   Post.findOneAndRemove({_id: targetId}, function (err, deletedPost) {
//     res.json(deletedPost);
//   });
// });
// // show current user
// app.get('/api/users/current', function (req, res) {
//   // check for current (logged-in) user
//   req.currentUser(function (err, user) {
//     res.json(user);
//   });
// });

// // create new log for current user
// app.post('/api/users/current/logs', function (req, res) {
//   // create new log with form data (`req.body`)
//   var newLog = new Log({
//     type: req.body.type,
//     calories: req.body.calories
//   });

//   // save new log
//   newLog.save();

//   // find current user
//   req.currentUser(function (err, user) {
//     // embed new log in user's logs
//     user.logs.push(newLog);
//     // save user (and new log)
//     user.save();
//     // respond with new log
//     res.json(newLog);
//   });
// });

// // show all logs
// app.get('/api/logs', function (req, res) {
//   Log.find(function (err, logs) {
//     res.json(logs);
//   });
// });

// // create new log
// app.post('/api/logs', function (req, res) {
//   // create new log with form data (`req.body`)
//   var newLog = new Log({
//     type: req.body.type,
//     calories: req.body.calories
//   });

//   // save new log
//   newLog.save(function (err, savedLog) {
//     res.json(savedLog);
//   });
// });
// //this is /get route which will get all the data in the server
// app.get('/user', function (req, res) {
//   User.find(function (err, user) {
//     res.json(user);
//   });
// });

// // LINES#QUERY
// app.get('/api/users', function(req, res) {
//  user.find().sort('-_id').exec(function(err, lines) {
//    console.log(user);
//    res.json(users);
//  });
// });

// // LINES#CREATE
// app.post('/api/user', function(req, res) {
//  // SAVE LINE TO DB
//  var user = new user({
//    text: req.body.text
//  });

//  user.save(function(err, line) {
//    console.log(user);
//    res.json(users);
//  });
// });

app.listen(process.env.PORT || 3000, function (){
	console.log('server started on localhost:3000');
});