$(document).ready(function() {
	// For review star display
	var rating = parseInt(parseFloat($('#review-rating-avg').val()) * 2);

	var pixelNum;
	if (rating < 2) {
		pixelNum = 0;
	} else {
		rating -= 1;
		pixelNum = -(rating * 39.8);
	}
	$('#review-star').css('background-position', '0px ' + pixelNum + 'px');

	
});