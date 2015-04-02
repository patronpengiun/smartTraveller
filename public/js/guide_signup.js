$(function() {
	$('.btn-next').click(function() {
		var cur_step = $(this).data('currentStep');
		if (!$('#signup-form').parsley().validate('step' + cur_step)) {
			return;
		} else {
			if (3 == cur_step) {
				$('#signup-form').submit();
			} else {
				$('#form-step' + cur_step).removeClass('show').addClass('hidden');
				$('#form-step' + (cur_step+1)).removeClass('hidden').addClass('show');
				$('#step-' + cur_step).removeClass('active').addClass('complete');
				$('#step-' + (cur_step+1)).removeClass('disable').addClass('active');
			}
		}
	});
});