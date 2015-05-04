$(document).ready(function() {
	var reviewer_id;
    var reviewer_name;
    var reviewee_id;
	var request_id;

	/****** For Navigation side bar ******/
	var guideId = $('#guide-id').val();
	var userId = $('#user-id').val();

	$('#nav-review').click(function() {
		// For review section
		$('#display-area').load("/dashboard_review/" + userId + " #review-area", function() {
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

	// For Navigation Setting Bar
	$('#nav-setting').click(function() {
		$('#display-area').load("/dashboard_setting/" + userId + " #setting-area", function() {
			// Bundle with edit info button
			$('#guide-info-edit').click(function() {
				$('#right-column-info-area').load("/dashboard_setting/" + userId + " #setting-edit-form", function() {

					// Requst to get guide object
					$.ajax({
						type:'GET', 
						url: "/api/guide/" + guideId, 
						success: function(res) {
							// Set default value for edit info blank
							var guideInfo = jQuery.parseJSON(res);			
							$('#name-input').val(guideInfo.name);
							$("[name = 'sex'][value = '" + guideInfo.sex + "']").attr("checked", "checked");
							$("[name = 'age']").val(guideInfo.age);
							$("option[value = '" + guideInfo.city + "']").attr("selected","selected");
							$("option[value = '" + guideInfo.hometown + "']").attr("selected","selected");
							if (guideInfo.occupation == "学生" || guideInfo.occupation == "在职") {
								$("[name = 'occupation'][value = '" + guideInfo.occupation + "']").attr("checked", "checked");
							} else {
								$("[name = 'occupation'][value = '其他']").attr("checked", "checked");
								$('input[name=occupation]:checked').parent().append($('<input class="showup-text-occupation" id="occupation_input" type="text" required data-parsley-group="step1">'));
								$("#occupation_input").val(guideInfo.occupation);
							}

							$("[name = 'phone']").val(guideInfo.phone);
							$("[name = 'car'][value = '" + guideInfo.car + "']").attr("checked", "checked");
							if (guideInfo.car) {
								$('.showup-text-car').removeClass('hidden');
								$("[name = 'car_brand']").val(guideInfo.car_brand);
								$("[name = 'car_model']").val(guideInfo.car_model);
								$("[name = 'car_year']").val(guideInfo.car_year);
							}

							$('#edit-info-form input[name=occupation]').on('change', function() {
								if($('input[name=occupation]:checked').val() == '其他'){
									$(this).parent().append($('<input class="showup-text-occupation" id="occupation_input" type="text" required data-parsley-group="step1">'));
								}

								if($('input[name=occupation]:checked').val() == '学生'){
									$('#occupation_input').remove();
								}

								if($('input[name=occupation]:checked').val() == '在职'){
									$('#occupation_input').remove();
								}
							});

							$('#edit-info-form input[name=car]').on('change', function() {
								if($('input[name=car]:checked', '#edit-info-form').val() == 'true'){
									$('.showup-text-car').removeClass('hidden');
								}
								if($('input[name=car]:checked', '#edit-info-form').val() == 'false'){
									$('.showup-text-car').addClass('hidden');
								}
							});

							guideInfo.language.forEach(function(lang) {
								$("input[name = 'language'][value = '" + lang + "']").attr("checked", "checked");
							});

							guideInfo.tags.forEach(function(tag) {
								$("input[name = 'tags'][value = '" + tag + "']").attr("checked", "checked");
							});

							$("textarea[name = 'intro1']").val(guideInfo.intro1);
							$("textarea[name = 'intro2']").val(guideInfo.intro2);
						}
					});					

					// For edit form submit
					$('#btn-submit').click(function(e) {
						if($('input[name=occupation]:checked').val() == '其他'){
							$('input[name=occupation]:checked').val($('#occupation_input').val());
						}
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

			$('#picture-btn-submit').click(function(e) {
				$.ajax({
					type: 'POST',
					contentType: false,
					processData: false,
					url: "/dashboard/settings/updateinfo",
					data: new FormData($('#picture-form')[0]),
					success: function(response) {
						$('#nav-setting').trigger("click");	
					}
				});
			});
		});
	});

	// For Navigation Request Bar
	$('#nav-request').click(function() {
		$('#display-area').load("/dashboard_request/" + userId + " #request-area", function() {
			$('#nav-request a[href="' + $('#nav-request').data("activeTab") + '"]').trigger("click");
			
			$('.btn-accept').click(function() {
				var requestId = $(this).siblings("input").val();
				$.ajax("/request/update/accept", {
					method: "POST",
					data: {
						id: requestId
					}
				}).done(function(response) {
					$('#nav-request').trigger("click");
				});
			});
			
			$('.btn-deny').click(function() {
				var requestId = $(this).siblings("input").val();
				$.ajax("/request/update/deny", {
					method: "POST",
					data: {
						id: requestId
					}
				}).done(function(response) {
					$('#nav-request').trigger("click");
				});
			});
			
			$('#nav-request a').click(function() {
				$('#nav-request').data("activeTab",$(this).attr("href"));
			});
			
			$('.btn-review').click(function() {
				$('#review-modal').modal('show');
				reviewer_id = $(this).data("reviewerid");
			    reviewer_name = $(this).data("reviewername");
			    reviewee_id = $(this).data("revieweeid");
				request_id = $(this).data("requestid");
			});
		});
	});
	
	$('#btn-submit-review').click(function() {
		$.ajax('/review/create', {
			method: "POST",
			data: {
    			reviewer_id: reviewer_id,
    			reviewer_name: reviewer_name,
    			reviewee_id: reviewee_id,
    			review_text: $("#review_text").val(),
    			rating: $("#rating").val(),
				request_id: request_id
			}
		}).done(function(response) {
			$("#review_text").val("");
			$("#rating").val("");
			$('#review-modal').modal('hide');
			$('#nav-request').trigger("click");
		});
	});

	// Dashboard display settings page first
	$('#nav-setting').trigger("click");

});
