/**
 * Created by lloughlin on 10/7/17.
 */


var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

//process.env.NODE_ENV  === 'development'
mongoose.connect(process.env.MONGODB_URI);
//mongoose.connect('mongodb://localhost:27017/TodoApp');

module.exports = {
    mongoose
};