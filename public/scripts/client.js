// CLIENT-SIDE JAVASCRIPT

$(function(){

	var postController = {

		// compile comment template
		template: _.template($('#posts-template').html()),

		all: function(){
			$.get('/posts', function(data){
				var allPost = data;

				// iterate through allposts
				_.each(allPost, function(post){
					// pass each posts object through template and append to view
					var $postHtml = $(postController.template(post));
					$('#post-list').append($postHtml);
				});
				// add event-handlers to posts for updating/deleting
				postController.addEventHandlers();
			});
		},

		create: function(newPost){
			var postData = {post: newPost};
			// send POST request to server to create new posts
			$.post('/api/posts', postData, function(data){
				var $postHtml = $(postController.template(data));
				$('#post-list').append($postHtml);
			});
		},	

		update : function(postId, updatedPost){
			// send PUT request to server to update the posts
			$.ajax({
					type: "POST",
					url: "/api/posts" + postId,
					data: {
							post: updatedPost
					},
					success: function(data){
						var updatedPost = data;

						var $postHtml = $(postController.template(updatedPost));
						$('#posts-' + postId).replaceWith($postHtml);
					}
			});
		},

		delete: function(postId){
			// send DELETE request to server to delete the post
			$.ajax({
					type: "DELETE",
					url: "/api/posts" + postId,
					success: function(data){

						// remove deleted post
						$('#post-' + postId).remove();
					}
			});
		},
		// add event-handlers to post for updating/deleting
		addEventHandlers: function(){
			$('#post-text');

			// for update: submit event on 'update-post' form
			.on('submit', 'update-post', function(event){
				event.preventDefault();

				// find the post's id
				var postId = $(this).closest('.post').attr('data-id');

				// delete the post
				postController.delete(postId);
			});
		},

		setupView: function(){
			// append the existing post to view
			postController.all();

			// add event-handler to new post form
			$('#new-post').on('submit', function(event){
				event.preventDefault();

				// create new post
				var newPost = $('#new-post').val();
				postController.create(newPost);

				// reset the form
				$(this)[0].reset();
				$('new-post').focus();
			});
		}
	};
	postController.setupView();
});

