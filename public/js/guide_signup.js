$(function() {
	$('.btn-next').click(function() {
		var cur_step = $(this).data('currentStep');
		if (!$('#signup-form').parsley().validate('step' + cur_step)) {
			return;
		} else {
			if (3 == cur_step) {
				for(var i = 1; i < 3; i++){
					if (!$('#signup-form').parsley().validate('step' + i)) {
						$('#form-step' + 3).removeClass('show').addClass('hidden');
						$('#form-step' + i).removeClass('hidden').addClass('show');
						$('#step-' + 3).removeClass('active').addClass('complete');
						$('#step-' + i).removeClass('disable').addClass('active');
						$('#signup-form').data('currentStep', i);
					}
				}
				$('#signup-form').submit();
			} else {
				$('#form-step' + cur_step).removeClass('show').addClass('hidden');
				$('#form-step' + (cur_step+1)).removeClass('hidden').addClass('show');
				$('#step-' + cur_step).removeClass('active').addClass('complete');
				$('#step-' + (cur_step+1)).removeClass('disable').addClass('active');
				$('#signup-form').data('currentStep', cur_step + 1);
			}
		}
	});


	$('.form-step').click(function() {
		if (!$(this).hasClass('complete')){
			return;
		}
		var next_step = $(this).data('step');
		var currentStep = $('#signup-form').data('currentStep');
		$('#form-step' + currentStep).removeClass('show').addClass('hidden');
		$('#form-step' + next_step).removeClass('hidden').addClass('show');
		$('#step-' + currentStep).removeClass('active').addClass('complete');
		$('#step-' + next_step).removeClass('complete').addClass('active');
		$('#signup-form').data('currentStep', next_step);
	});

});