const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');

const {Todo} = require('./../server/models/Todo');
const {User} = require('./../server/models/Users');


// Todo.remove({}).then((result) => {
//     console.log(result);
// });
// // Todo.remove()
//
// Todo.findOneAndRemove(, (doc) => {
//
// });

Todo.findByIdAndRemove('596457f5cec51da138f602de').then((doc) => {
    console.log(JSON.stringify(doc));
});