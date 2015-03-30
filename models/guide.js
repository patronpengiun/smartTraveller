var mongoose = require('mongoose');
 
module.exports = mongoose.model('Guide',{
    username: String,
    name: String,
	sex: String,
	city: String,
	age: String,
	hometown: String,
	occupation: String,

	//联系方式(电话，微信，WhatsApp，邮箱)，也许分成四个field比较好
	contact_type: String,
	contact_value: String,

	car: Boolean,
	car_model: String,
	car_year: String,
	car_passengers: Number,//多少座, driver exculded

	intro1: String,
	intro2: String,
	//intro3: String,
	
	tags: [String],
	photos: [String],
});