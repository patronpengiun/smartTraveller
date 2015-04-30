var mongoose = require('mongoose');

module.exports = mongoose.model('Message', {
    user: String,
    userName: String,
    guide: String,
    guideName: String,
    sender:String,
    content: String,
    timeStamp: {type: Date, default: Date.now},
    isRead: Boolean,
});