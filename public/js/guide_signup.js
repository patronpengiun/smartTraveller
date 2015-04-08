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



$(document).ready( function() {
  	$('#signup-form input').on('change', function() {
  		if($('input[name=occupation]:checked', '#signup-form').val() == '其他'){
  			$('.showup-text-occupation').removeClass('hidden');
  			$('input[name=occupation]:checked', '#signup-form').val() = $('#occupation_input').val();
  		}
  		if($('input[name=occupation]:checked', '#signup-form').val() == '学生'){
  			$('.showup-text-occupation').addClass('hidden');
  		}

  		if($('input[name=car]:checked', '#signup-form').val() == 'true'){
  			$('.showup-text-car').removeClass('hidden');
  		}
  		if($('input[name=car]:checked', '#signup-form').val() == 'false'){
  			$('.showup-text-car').addClass('hidden');
  		}
	}); 		
});