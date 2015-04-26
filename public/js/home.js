$(function() {
	$('#login-btn').click(function() {
		$.ajax(
			'/login',
			{
				data: {
					username: $('#login-username').val(), 
					password: $('#login-password').val(),
				},
				type: 'POST',
			}
		).done(loginCallback);
	});
	
	$('#signup-btn').click(function() {
		$.ajax(
			'/signup',
			{
				data: {
					username: $('#signup-username').val(), 
					password: $('#signup-password').val(),
				},
				type: 'POST',
			}
		).done(signupCallback);
	})

	$('#start-date').datepicker();
	$('#end-date').datepicker();
});

function loginCallback(data) {
	if (data.message == "success") {
		$("#login-modal").modal("hide");
		$('#login-control').hide();
		$('#user-display').text(data.user.username);
		$('#user-control').show()
	} else {
		$("#login-modal .error-wrapper").show();
		$('#login-username').val("");
		$('#login-password').val("");
	}
}

function signupCallback(data) {
	if (data.message == "success") {
		$("#signup-modal").modal("hide");
		alert("亲爱的" + data.user.username + ",欢迎加入旅橙网！");
		$('#login-control').hide();
		$('#user-display').text(data.user.username);
		$('#user-control').show()
	} else if (data.message == "exist") {
		$("#signup-modal .error-wrapper").show();
		$('#signup-username').val("");
		$('#signup-password').val("");
	}
}