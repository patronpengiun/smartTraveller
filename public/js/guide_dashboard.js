$(document).ready(function() {
	var guideId = $('#guide-id').val();

	$('#nav-review').click(function() {
		// For review section
		$('#display-area').load("/dashboard_review/" + guideId + " #review-area", function() {
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
	});

	$('#nav-setting').click(function() {
		$('#display-area').load("/dashboard_setting/" + guideId + " #setting-area", function() {

		});
	});

	$('#nav-request').click(function() {
		$('#display-area').load("/dashboard_request/" + guideId + " #request-area", function() {
			
		});
	});
});
