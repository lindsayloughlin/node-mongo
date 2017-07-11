var bodyParser = require('body-parser');
var express = require('express');


var mongoose = require('./db/mongoose');
var {Todo} = require('./models/Todo');
var {User} = require('./models/Users');
var {ObjectID} = require('mongodb');

// var newTodo = new Todo({
// 	text: 'Cook dinner'
// });
// newTodo.save().next(()=>{

// }, (e) => {
// 	console.log('Unable to save todo');
// });


var app = express();

app.use(bodyParser.json());
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

app.get('/todos/', (req, res) => {
    Todo.find().then((todos) => {
        res.send({todos});
    }, (e) => {
        res.status(400).send(e);

    });

});

app.get('/todos/:id', (req, res) => {
    //res.send(req.params);

    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    // Find by id
    Todo.findById(id).then((todo) => {
        if (todo) {
            return res.send({todo});
        }
        res.status(404).send();

    }).catch((err) => {
        res.status(500).send(err);
    });
});

app.post('/users', (req, res) => {
    var user = new User({
        email: req.body.email
    });

    user.save().then((item) => {
        console.log('saved user item')
        res.send(item);
    });
});

app.post('/todos/', (req, res) => {
    //console.log(req.body);
    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then((item) => {
        console.log('saved item');
        res.send(item);
    }, (e) => {
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

