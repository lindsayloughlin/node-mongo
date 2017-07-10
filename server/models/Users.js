/**
 * Created by lloughlin on 10/7/17.
 */

var mongoose = require('mongoose');

var User = mongoose.model('User', {
    email: {
        required: true,
        trim: true,
        type: String,
        minlength: 1
    },
});

module.exports = {
    User
};
