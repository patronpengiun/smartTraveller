var mongoose = require('mongoose');

module.exports = mongoose.model('Request', {
    guideId: String,
    customerId: String,
    startDate: Date,
    endDate: Date,
    
    selfDescription: String,
    requirements: String,
	
	status: {type: String, enum: ['pending', 'denied', 'accepted', 'completed', 'reviewed']},
});
