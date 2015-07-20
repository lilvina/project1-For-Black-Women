$(function(){
	$('#new-post').submit(function(e){
   e.preventDefault();
   console.log("im submitting a form")
   var blog = {
     text: $('#post-text').val()
   }
   $.post('/api/blogs', blog, function(data) {
     console.log(data)
     $('#posts').prepend($blog(data))
   })
});

function simulateClick() {
 var event = new MouseEvent('click', {
   'view': window,
   'bubbles': true,
   'cancelable': true
 });
 var cb = document.getElementById('checkbox'); 
 var canceled = !cb.dispatchEvent(event);
 if (canceled) {
   // A handler called preventDefault.
   alert("canceled");
 } else {
   // None of the handlers called preventDefault.
   alert("not canceled");
 }
}

var event = new CustomEvent('build', { 'detail': elem.dataset.time});

function eventHandler(e) {
 log('The time is: ' + e.detail);
}

