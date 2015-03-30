var mongoose = require('mongoose');
 
module.exports = mongoose.model('Guide',{
    username: String,
    name: String,
	sex: String,
	city: String,
	age: String,
	hometown: String,
	occupation: String,
	tags: [String],
	phone: String,
	car: Boolean,
	car_type: String,
	weixin: String,
	intro1: String,
	intro2: String,
	intro3: String,
	photos: [String],
});