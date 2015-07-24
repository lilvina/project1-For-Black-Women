$(function(){
	
	var $newPost = $('#new-post');

	var $postText = $('#post-text');

	var $results = $('#results');

	var $postList = $('#post-list');

	var postsTemplate = _.template($('#posts-template').html());


	$.get("/api/posts", function(data){
		_.each(data, function (post, index){
			console.log(post);
			var $post = $(postsTemplate(post));
			// $post.attr('data-index', index);
			$postList.append($post);
		});
	});

	// make the submit button to work
	$newPost.on('submit', function(event){
		console.log("Hi, I'm submitted!");
		event.preventDefault();

		$postList.append($postText.val());

	});

	$('#logout').on('click', function(){
		$.get("/login", function(){
			window.location = '/login';
			console.log('logged out');
		});
	});

});




