$(document).ready(function() {
	var length = parseInt($('#photo-life-count').val());
	var curr = 0;

	$('#photo_life_0').removeClass("hidden");	
	
	$('#photo_life_next_button').click(function() {
		$('#photo_life_' + curr).addClass("hidden");
		var next = (curr + 1) % length;
		$('#photo_life_' + next).removeClass("hidden");
		curr = next;
	});

	$('#photo_life_previous_button').click(function() {
		$('#photo_life_' + curr).addClass("hidden");
		var previous = (curr - 1 + length) % length;
		$('#photo_life_' + previous).removeClass("hidden");
		curr = previous;
	});
});