var mongoose = require('mongoose');
 
module.exports = mongoose.model('Review',{
    reviewer_id: String,
    reviewee_id: String,
    review_text: String,
    date: String,
});