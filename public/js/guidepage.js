$(document).ready(function() {

	// Test display effect
	var comment = "第一次来纽约旅行，能够认识小晗向导非常荣幸， \
	她热情周到的服务给原本寒冷的冬日之旅增添了异国他乡的温暖，让我们非常感动！\
	感谢小晗，感谢SmartTraveller，我们以后再合作！";

	var str = "";
	for (var i = 0; i < 5; i++) {
		str += "<p>" + comment + "</p><hr>"
	};
	$("#review-box").append(str);

});