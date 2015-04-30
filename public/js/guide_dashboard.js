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
		});
	});

	$('#nav-request').click(function() {
		$('#display-area').load("/dashboard_request/" + guideId + " #request-area", function() {

		});
	});


	
});
