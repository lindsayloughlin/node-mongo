

const {ObjectID} = require('mongodb');

const {Todo} = require('../../models/Todo');
const {User} = require('../../models/Users');
const jwt = require('jsonwebtoken');



let user1Id = new ObjectID();
let user2Id = new ObjectID();

let signPass = 'abc123';

const users = [{
    _id: user1Id,
    email: 'l@l1.com',
    password: 'userOnePass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: user1Id, access: 'auth'}, signPass).toString()
    }],
},{
    _id: user2Id,
    email: 'l2@l2.com',
    password: 'userTwoPass',
    tokens:[{
        access: 'auth',
        token: jwt.sign({_id: user2Id, access: 'auth'}, signPass).toString()
    }]
}];

const todosSeed = [{
    text: 'First test todo',
    _id: new ObjectID(),
    _creator: user1Id
}, {
    text: 'Second test todo',
    completed: true,
    completedAt: 333,
    _id: new ObjectID(),
    _creator: user2Id
}];


// wipe everything.
const populateTodos = (done)=> {

    Todo.remove({}).then(() => {
        return Todo.insertMany(todosSeed);
    }).then(() => done());
};


const populateUsers = (done) => {
    User.remove({}).then(() => {
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();
        return Promise.all([userOne, userTwo])
    }).then(() => done());
};
module.exports = {
    todosSeed,
    populateTodos,
    users,
    populateUsers
};
