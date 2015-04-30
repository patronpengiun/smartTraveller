$(function() {
	$('.btn-next').click(function() {
		if(!$('#signup-form').parsley().validate('step1')){
			return;
		} else {
			$('.form-step1').removeClass('show').addClass('hidden');
			$('.form-step2').removeClass('hidden').addClass('show');
		}
	});	

	$('.btn-previous').click(function() {
			$('.form-step2').removeClass('show').addClass('hidden');
			$('.form-step1').removeClass('hidden').addClass('show');
	});	

	$('.btn-submit').click(function() {
		if(!$('#signup-form').parsley().validate('step2')){
			return;
		} else {
			if($('input[name=occupation]:checked').val() == '其他'){
				$('input[name=occupation]:checked').val($('#occupation_input').val());
			}
			$('.two-btn').hide();
			$('.submit-notice').show();
			$('#signup-form').submit();
		}
			
	});

});

$(document).ready(function() {
  	$('#signup-form input[name=occupation]').on('change', function() {
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
	
	$('#signup-form input[name=car]').on('change', function() {
  		if($('input[name=car]:checked', '#signup-form').val() == 'true'){
  			$('.showup-text-car').removeClass('hidden');
  		}
  		if($('input[name=car]:checked', '#signup-form').val() == 'false'){
  			$('.showup-text-car').addClass('hidden');
  		}
	});
	
	 		
});