$(function() {
	$('.btn-next').click(function() {
		//if(!$('#signup-form').parsley().validate('step1')){
		//	return;
		//} else {
			$('.form-step1').removeClass('show').addClass('hidden');
			$('.form-step2').removeClass('hidden').addClass('show');
		//}
	});	

	$('.btn-previous').click(function() {
			$('.form-step2').removeClass('show').addClass('hidden');
			$('.form-step1').removeClass('hidden').addClass('show');
	});	

	$('.btn-submit').click(function() {
		if(!$('#signup-form').parsley().validate('step2')){
			return;
		} else {
			$('#signup-form').submit();
		}
			
	});

});