

var bodyParser = require('body-parser');
var express = require('express');

var mongoose = require('./db/mongoose');
var {Todo} = require('./models/Todo');
var {User} = require('./models/Users')



// var newTodo = new Todo({
// 	text: 'Cook dinner'
// });
// newTodo.save().next(()=>{

// }, (e) => {
// 	console.log('Unable to save todo');
// });


var app = express();

app.use(bodyParser.json());

app.listen(3000, ()=>{
    console.log('Started on port 3000');
});

app.post('/todos/', (req, res) => {
    //console.log(req.body);
    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then((item) => {
        console.log('saved item');
        res.send(item);
    }, (e)=>{
       console.log(e);
       res.status(400).send(e);
    });
});

module.exports.app = app;


// var otherTodo = new Todo({
// 	text: 'edit this video',
// 	completed: true,
// 	completedAt: 123
// });
// var myUser = new User({
//     email: 'lindsayloughlin@gmail.com'
// });
//
// myUser.save().then((doc)=>{
//     console.log(JSON.stringify(doc));
// });
//
// otherTodo.save().then((doc)=> {
// 	console.log(JSON.stringify(doc, undefined, 2));
// }, (e) => {
// 	console.log('unable to save', e);
// });

