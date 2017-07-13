require('./config');

const bodyParser = require('body-parser');
const express = require('express');
const _ = require('lodash');


const mongoose = require('./db/mongoose');
var {Todo} = require('./models/Todo');
var {User} = require('./models/Users');
var {ObjectID} = require('mongodb');
var {authenticate} = require('./middleware/middleware');
const bcrypt = require('bcryptjs');

// var newTodo = new Todo({
// 	text: 'Cook dinner'
// });
// newTodo.save().next(()=>{

// }, (e) => {
// 	console.log('Unable to save todo');
// });


var app = express();

app.use(bodyParser.json());
const port = process.env.PORT;

app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

app.get('/todos', authenticate, (req, res) => {
    console.log('trying to find some todos');
    Todo.find({
        _creator: req.user._id
    }).then((todos) => {
        console.log('found some todos');
        res.send({todos});
    }, (e) => {
        res.status(400).send(e);
    });

});

app.patch('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    var body = _.pick(req.body, ['text', 'completed']);
    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.complete = false;
        body.completedAt = null;
    }
    //db.findByIdAndUpdate(id, {$set: body}, {returnOriginal: false, new: true} )
    Todo.findOneAndUpdate({_id: id, _creator: req.user._id }, {$set: body}, {new: true}).then((todo) => {
        if (!todo) {
            return res.send(404).send();
        }
        res.send({todo});
    }).catch((e) => {
        res.status(400).send(e);
    });
});


app.post('/users/login', (req, res) => {

    var userinfo = _.pick(req.body, ['email', 'password']);
    //return res.send(userinfo);
    // '$2a$10$qytJe1Mz35ys85l.lxQ1neSIrQcIRkuPyLCFCtGCPnWHvDdzlG3S.'

    User.findByCredentials(userinfo.email, userinfo.password).then((user) => {
        //return res.send(user);
        return user.generateAuthToken().then((token) => {
            //console.log(`in login ${token}`);
            //user.save();
            res.header('x-auth', token).send(user);
        });
    }).catch((e) => {
        console.log('unable to find user');
        res.status(401).send();
    });

});

app.get('/users/me', authenticate, (req, res) => {
    // console.log('/user/me function');
    // console.log(`user : ${req.user}`);
    res.send(req.user);
});

app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }, () => {
        res.status(400).send();
    });
});

app.get('/todos/:id', authenticate, (req, res) => {
    //res.send(req.params);

    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    // Find by id
    Todo.findOne({ _id: id, _creator: req.user._id})
        .then((todo) => {
        if (todo) {
            return res.send({todo});
        }
        res.status(404).send();

    }).catch((err) => {
        res.status(500).send(err);
    });
});

app.post('/users', (req, res) => {

    var body = _.pick(req.body, ['email', 'password']);

    var user = new User(body);
    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token).send(user);
    }).catch((e) => {
        res.status(400).send(e);
    });

    // user.save().then((item) => {
    //     console.log('saved user item');
    //     res.send({item});
    // });
});


app.delete('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    // console.log(`going to delete ${id}`);
    Todo.findOneAndRemove({ _id: id, _creator : req.user._id}
        ).then((todo) => {
        // console.log(`deleted ${JSON.stringify(todo)}`);
        if (!todo) {
            return res.status(404).send();
        }
        res.send({todo});
    }, (err) => {
        // console.log('unable to remove ' + id);
        res.sent(err);
    });
});


app.post('/todos/', authenticate, (req, res) => {
    //console.log(req.body);
    var todo = new Todo({
        text: req.body.text,
        _creator: req.user._id
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

