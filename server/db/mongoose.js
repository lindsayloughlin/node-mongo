/**
 * Created by lloughlin on 10/7/17.
 */


var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp');
//mongoose.connect('mongodb://localhost:27017/TodoApp');

module.exports = {
    mongoose
};