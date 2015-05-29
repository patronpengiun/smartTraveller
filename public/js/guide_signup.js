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
			 init_upload('portrait_file', false);
			 init_upload('view_files', false);
			 init_upload('life_files', false);
			 //init_upload('portrait_file', true);
			 console.log("pictures are uploaded");

			 $('#signup-form').ajaxForm({
			 	url : '/signup/guide/apply',
				success : function (response) {
					send_Notification_email();
					if(response === 'OK'){
						alert("您已成功提交申请，谢谢！");
					}
				}
   	 		});
			 $('#signup-form').submit(); 
		}
	});

	function send_Notification_email(){
		var email = $('#username').val();
		//if this is a logged in user
		if(email == undefined){
			email = 'email';
		}
		else{
			email = $('#username').val();
		}
		var name = $('#name').val();
		var phone = $('#phone').val();
        $.get("/sendmail",{name:name,email:email,phone:phone},function(data){
	        if(data=="sent")
	        {
	        	console.log("Email sent successfully.");
	        }
		});
	}

	/*
    Function to carry out the actual PUT request to S3 using the signed request from the app.
	*/
	function upload_file(file, signed_request, url, ifLast){
		console.log("enter upload_file");
	    var xhr = new XMLHttpRequest();
	    xhr.open("PUT", signed_request);
	    xhr.setRequestHeader('x-amz-acl', 'private');
	    xhr.onload = function() {
	        if (xhr.status === 200) {
	            console.log(file.name + " uploaded!")
	            if(ifLast){
	            	$('#signup-form').submit(); 
	            }
	        }
	    };
	    xhr.onerror = function() {
	        alert("Could not upload file."); 
	    };
	    xhr.send(file);
	}
	/*
	    Function to get the temporary signed request from the app.
	    If request successful, continue to upload the file using this signed
	    request.
	*/
	function get_signed_request(file, ifLast){
		var username;
		if(document.getElementById('username') != null){
			username = document.getElementById('username').value;
		}
		else{
			username = 'username';
		}
		
	    var xhr = new XMLHttpRequest();
	    xhr.open("GET", "/sign_s3?file_name="+file.name+"&file_type="+file.type+"&username="+username);
	    xhr.onreadystatechange = function(){
	        if(xhr.readyState === 4){
	            if(xhr.status === 200){
	                var response = JSON.parse(xhr.responseText);
	                upload_file(file, response.signed_request, response.url, ifLast);
	            }
	            else{
	                alert("Could not get signed URL.");
	            }
	        }
	    };
	    xhr.send();
	}
	/*
	   Function called when file input updated. If there is a file selected, then
	   start upload procedure by asking for a signed request from the app.
	*/
	function init_upload(id, ifLast){
	    var files = document.getElementById(id).files;
    	for(var i = 0; i < files.length; i++){
	        var file = files[i];
	        if(file == null){
	            alert("No file selected.");
	            return;
	        }
	        // if this is the last file of last input element, set ifLast flag
	        var myIfLast = false;
	        if(ifLast && i === files.length - 1){
	        	myIfLast = true;
	        }
	        get_signed_request(file, myIfLast);
		}
	}
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