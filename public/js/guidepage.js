$(document).ready(function() {
	// For Facebook share button
	// Useful when directing URL is a online URL
	$('.fb-share-button').attr("data-href", document.URL); 	

	var length_life = parseInt($('#photo-life-count').val());
	var curr_life = 0;

	$('#photo_life_0').removeClass("hidden");	
	
	$('#photo_life_next_button').click(function(e) {
		$('#photo_life_' + curr_life).addClass("hidden");
		var next = (curr_life + 1) % length_life;
		$('#photo_life_' + next).removeClass("hidden");
		curr_life = next;

		e.preventDefault();	// prevent refresh the page 
	});

	$('#photo_life_previous_button').click(function(e) {
		$('#photo_life_' + curr_life).addClass("hidden");
		var previous = (curr_life - 1 + length_life) % length_life;
		$('#photo_life_' + previous).removeClass("hidden");
		curr_life = previous;

		e.preventDefault();
	});

	var length_view = parseInt($('#photo-view-count').val());
	var curr_view = 0;

	$('#photo_view_0').removeClass("hidden");	
	
	$('#photo_view_next_button').click(function(e) {
		$('#photo_view_' + curr_view).addClass("hidden");
		var next = (curr_view + 1) % length_view;
		$('#photo_view_' + next).removeClass("hidden");
		curr_view = next;

		e.preventDefault();
	});

	$('#photo_view_previous_button').click(function(e) {
		$('#photo_view_' + curr_view).addClass("hidden");
		var previous = (curr_view - 1 + length_view) % length_view;
		$('#photo_view_' + previous).removeClass("hidden");
		curr_view = previous;

		e.preventDefault();
	});

	
});