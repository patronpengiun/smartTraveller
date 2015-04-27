$(function() {
	$('#start-date').datepicker();
	$('#end-date').datepicker();

	$('#submitBtn').click(function() {
		$('#request-form').submit();
	});
});