var mongoose = require('mongoose');
 
module.exports = mongoose.model('User',{
    username: String,
    password: String,
	role: {type: String, enum: ['user', 'guide', 'admin']},
});