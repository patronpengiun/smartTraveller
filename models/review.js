var mongoose = require('mongoose');
 
module.exports = mongoose.model('Review',{
    reviewer_id: String,
    reviewer_name: String,
    reviewee_id: String,
    review_text: String,
    date: String,
});