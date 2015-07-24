$(function(){
	
	var $newPost = $('#new-post');

	var $postText = $('#post-text');

	var $results = $('#results');

	var $topicsList = $('#topics-list');

	var blogTemplate = _.template($('#blog-template').html());

	// make the submit button to work
	$newPost.on('submit', function(event){
		console.log("Hi, I'm submitted!");
		event.preventDefault();


	})

	var topics = [
		{post: "Test 1,2,3"},
		{post: "Let's go!"},
		{post: "Yay!"}
	];

	_.each(topics, function (topic, index){
		var $topic = $(blogTemplate(topic));
		$topic.attr('data-index', index);
		$topicsList.append($topic);
	})

});

// $.ajax({
// 	url: 'ajax/index.html',
// 	success: function(data){
// 		alert('Hurray the AJAX call succeeded!');
// 	},
// 	error: function(xhr, error){
// 		alert('Error time!');
// 	}
// });


