var mongoose = require('mongoose');

module.exports = mongoose.model('Place', {
    name: String,
    address: String,
    
    intro_short: String,
    intro_long: String,

    photos: [String],
    guide_count: Number,
    tags: [String]
});
