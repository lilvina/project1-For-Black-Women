// require dependencies
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var PostSchema = new Schema({
	description: String,
	postedBy: {type: mongoose.Schema.Types.ObjectId},
	dateCreated: Date,
	comments: [{body:"string", by: mongoose.Schema.Types.ObjectId}],
});

var Post = mongoose.model('Post', PostSchema);
module.exports = Post;