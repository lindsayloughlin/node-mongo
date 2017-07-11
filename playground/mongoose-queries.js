/**
 * Created by lloughlin on 10/7/17.
 */


const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');

const {Todo} = require('./../server/models/Todo');
const {User} = require('./../server/models/Users');

var id = '5963252d8037012d8033287c';

//ObjectId.isValid()



// if (!ObjectID.isValid(notValidId )) {
//     console.log('ID not valid');
// }
//
//
// Todo.find({
//     _id: id
// }).then((todos)=>{
//     console.log('Todos', todos);
// });
//
//
// Todo.findOne({
//
// }).then((todo)=>{
//   console.log('Todo-find one', todo);
// });


Todo.findById(id).then((todo)=>{
    console.log('Todo-find by id', todo);
});

User.findById('59641668c143166dd498e2f7').then((user)=> {
    if (!user) {
        return console.log('Unabel to find user');
    }
    console.log(JSON.stringify(user,undefined,2));
}, (e)=> {
    console.log(e)
});

