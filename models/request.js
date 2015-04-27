var mongoose = require('mongoose');

module.exports = mongoose.model('Request', {
    guideId: String,
    customer_Username: String,
    startDate: String,
    endDate: String,
    
    selfDescription: String,
    requirements: String,
});
