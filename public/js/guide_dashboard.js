$(document).ready(function() {

	/****** For Navigation side bar ******/
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
			// Bundle with edit info button
			$('#guide-info-edit').click(function() {
				$('#right-column-info-area').load("/dashboard_setting/" + guideId + " #setting-edit-form", function() {
					// Set default value for edit info blank
					var rawData = $('#guide-info-hidden-input').val();
					var guideInfo = jQuery.parseJSON(rawData);			
					$('#name-input').attr("value", guideInfo.name);
					

					// For edit form submit
					$('#btn-submit').click(function(e) {
						$.ajax({
							type:'POST', 
							url: "/dashboard/settings/updateinfo", 
							data:$('#edit-info-form').serialize(), 
							success: function(response) {
								$('#nav-setting').trigger("click");
							}
						});
						
						e.preventDefault();
					});
				});
			});
		});
	});

	$('#nav-request').click(function() {
		$('#display-area').load("/dashboard_request/" + guideId + " #request-area", function() {
			
		});
	});
});
