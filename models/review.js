var mongoose = require('mongoose');
 
module.exports = mongoose.model('Review',{
	request_id: String,
    reviewer_id: String,
    reviewer_name: String,
    reviewee_id: String,
    review_text: String,
    rating: Number,
    date: String,
});