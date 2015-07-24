// require dependencies
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	bcrypt = require('bcrypt'),
	salt = bcrypt.genSaltSync(10);



// var CommentSchema = new Comment({
// 	description: String
// });

// define user schema
var UserSchema = new Schema({
	email: String,
	password: String
});

// create a new user with secure password
UserSchema.statics.createSecure = function (email, password, callback){
	// store it in a variable 'that' because 'this' changes context in nested callbacks
	var that = this;

	// hash password user enters at sign up
	bcrypt.genSalt(function(err, salt){
		bcrypt.hash(password, salt, function (err, hash){
			console.log(hash);

			// create the new user (save to db) with hashed password
			that.create({
				email: email,
				password: hash
			}, callback);
		});
	});
};

// authenticate user
UserSchema.statics.authenticate = function (email, password, callback){
	// finc user by email entered at log in
	this.findOne({email: email}, function (err, user){
		console.log(user);

		// throw error if can't find user
		if (user === null){
			callback("NOT FOUND", null);
			// if found user, check if password is correct
		} else if (user.checkPassword(password)){
			callback(null, user);
		} else {
			callback("ERR", null)
		}
	});
};

// compare password when someone enters with hased password
UserSchema.methods.checkPassword = function (password){
	// run hashing algorithm (with salt) on password when someone enters in order to compare with 'password'
	return bcrypt.compareSync(password, this.password);
};

// define user model
var User = mongoose.model('User', UserSchema);
// export user model
module.exports = User;

// // define comment model
// var Comment = mongoose.model('Comment', CommentSchema);
// // export comment model
// module.exports = Comment;
