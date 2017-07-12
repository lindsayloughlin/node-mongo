

const {ObjectID} = require('mongodb');

const {Todo} = require('../../models/Todo');
const {User} = require('../../models/Users');
const jwt = require('jsonwebtoken');



let user1Id = new ObjectID();
let user2Id = new ObjectID();

let signPass = 'abc123';

const users = [{
    _id: user1Id,
    email: 'l@l.com',
    password: 'userOnePass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: user1Id, access: 'auth'}, signPass).toString()
    }]
},{
    _id: user2Id,
    email: 'l2@l2.com',
    password: 'userTwoPass',
    tokens: jwt.sign({_id: user2Id, access: 'auth'}, signPass).toString()
}];;;;;;;;;

const todosSeed = [{
    text: 'First test todo',
    _id: new ObjectID()
}, {
    text: 'Second test todo',
    completed: true,
    completedAt: 333,
    _id: new ObjectID()
}];


// wipe everything.
const populateTodos = (done)=> {

    Todo.remove({}).then(() => {
        return Todo.insertMany(todosSeed);
    }).then(() => done());
};

const populateUsers=  (done)=>{
    console.log('populating users');
    User.remove({}).then(() => {
        //return User.insertMany(users);

        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();

        Promise.all([userOne,userTwo]);
    }).then(() => done());
};;;;;;;;;

module.exports = {
    todosSeed,
    populateTodos,
    users,
    populateUsers
};;;;;;;;;
