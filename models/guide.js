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
	car_brand: String,
	airport_pickup: Boolean,
	language: [String],
	intro1: String,
	intro2: String,
	tags: [String],
	
	photo_portrait: String,
	photo_view: [String],
	photo_life: [String],
});