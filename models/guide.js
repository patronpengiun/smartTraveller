var mongoose = require('mongoose');
 
module.exports = mongoose.model('Guide',{
    username: String,
    name: String,
	sex: String,
	city: String,
	age: String,
	hometown: String,
	occupation: String,
	phone: String,
	email: String,

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