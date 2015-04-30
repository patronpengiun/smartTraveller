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
	
	$('#logout-tab').click(function() {
		$.ajax("/logout", {
			type: "POST"
		}).done(function(res) {
			alert(res.message);
		})
	})
});

function loginCallback(data) {
	if (data.message == "success") {
		$("#login-modal").modal("hide");
		$('#login-control').addClass("hidden");
		$('#user-display').text(data.user.username);
		$('#user-control').removeClass("hidden");
		$('#dashboard-tab a').attr("href","/guide/dashboard/"+data.user._id);
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
		$('#login-control').addClass("hidden");
		$('#user-display').text(data.user.username);
		$('#user-control').removeClass("hidden");
		$('#dashboard-tab a').attr("href","/guide/dashboard/"+data.user._id);
	} else if (data.message == "exist") {
		$("#signup-modal .error-wrapper").show();
		$('#signup-username').val("");
		$('#signup-password').val("");
	}
}