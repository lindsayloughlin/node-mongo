const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');


const {app} = require('./../server');
const {Todo} = require('./../models/Todo');
const {User} = require('./../models/Users');
const {todosSeed, populateTodos, users, populateUsers} = require('./seed/seed');


beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {

    var text = 'Test todo text';
    it('should create a new todo', (done) => {

        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Todo.find({text}).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should not create todo with invalid body data', (done) => {
        var somethingelse = 'Test todo text';

        request(app)
            .post('/todos')
            .send({somethingelse})
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Todo.find({somethingelse}).then((todos) => {
                    expect(todos.length).toBe(0);
                    console.log('checked length');
                    done();
                }).catch((e) => done(e));
            });

    });
});

describe('/users test', () => {

    describe(' for /me part', () => {

        it('should return user if authenticated', (done) => {
            // return the current user.
            console.log('token', users[0].tokens[0].token);
            request(app)
                .get('/users/me')
                .set('x-auth', users[0].tokens[0].token)
                .expect(200)
                .expect((res) => {
                    expect(res.body._id).toBe(users[0]._id.toHexString());
                    // expect(res.body.email).toBe(users[0].email);
                })
                .end(done);
        });

        it('should return a 401 if not authenticated', (done) => {
            request(app)
                .get('/users/me')
                .set('x-auth', 'not a valid hash')
                .expect(401)
                .expect((res) => {
                    expect(res.body).toEqual({});
                })
                .end(done);
        });
    });

    describe('user signup', () => {
        it('should create a new user', (done) => {
            var email = 'newuser@test.com';
            var password = 'testpassword';
            request(app)
                .post('/users')
                .send({
                    email,
                    password
                })
                .expect(200)
                .expect((res)=>{
                    User.findOne({email}).then((user)=>{
                        expect(user).toExist();
                        expect(user.password).toNotBe(password);

                    });

                })
                .end(done)

        });

        it('should return validation errors if request invalid', (done)=>{
            request(app)
                .post('/users')
                .send({
                    email: 'seconduser@test1.com',
                    password: 'short'
                })
                .expect(400)
                // .expect((res)=>{
                // })
                .end(done);
        });

        it('should return validation errors for duplicate email', (done)=>{
            request(app)
                .post('/users')
                .send({
                    email: users[0].email,
                    password: 'alongenoughpassword'
                })
                .expect(400)
                .end(done);
        });
    });

});

describe('GET /todos', () => {

    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2);
                console.log('done checking length');
            })
            .end(done)
    });

    describe('GET /todos/:id', () => {

        it('should return a 404 if todo not found', (done) => {
            var fakeId = new ObjectID();
            request(app)
                .get(`/todos/${fakeId.toHexString()}`)
                .expect(404)
                .end(done);
        });


        it('should get a specific todo by id', (done) => {
            request(app)
                .get(`/todos/${todosSeed[0]._id.toHexString()}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body.todo.text).toBe(todosSeed[0].text);
                })
                .end(done);
        });


        it('should get a specific 404 for non-object ids', (done) => {
            request(app)
                .get(`/todos/123avc`)
                .expect(404)
                .end(done);
        });
    });


    describe('DELETE /todos/:id', () => {
        it('should remove a todo', (done) => {
            //console.log(`printing todo ${JSON.stringify(todosSeed[1]._id)}`);
            var hexId = todosSeed[1]._id.toHexString();
            request(app)
                .delete(`/todos/${hexId}`)
                .expect(200)
                .expect((res) => {
                    // console.log(`printing result ${JSON.stringify(res.body.result._id)}`);
                    //expect(res.body.result._id).toBe(hexId);

                })
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    //expect(Todo.findById(hexId).count().toBe(0));
                    Todo.findById(hexId).then((todo) => {
                        console.log(`json item ${JSON.stringify(todo)}`);
                        expect(todo).toNotExist();
                        done();
                    }).catch((e) => done(e));
                });
        });

        it('should return a 404 when todo is not found', (done) => {
            var hexId = todosSeed[1]._id.toHexString();
            var invalid = 'notvalid';
            request(app)
                .delete(`/todos/${invalid}`)
                .expect(404)
                .end(done);
        });

        it('should return a 404 when todo is invalid', (done) => {

            var invalid = 'notvalid';
            request(app)
                .delete(`/todos/${invalid}`)
                .expect(404)
                .end(done);
        });


    });

    describe('it should patch the todo', () => {
        it('it should patch the todo', (done) => {

            // 200
            // custom assert text == updated
            // completed == true
            // completedAt is number.

            var id = todosSeed[0]._id.toHexString();
            var text = 'new text';
            request(app).patch(`/todos/${id}`)
                .send({completed: true, text})
                .expect(200)
                .expect((res) => {
                    console.log(JSON.stringify(res.body));
                    var todo = res.body.todo;
                    expect(todo.text).toBe(text);
                    expect(todo.completed).toBe(true);
                    expect(todo.completedAt).toExist().toBeA('number');

                })
                .end(done)
        });

        it('it should clear completedAt at when completed is omitted', (done) => {

            var id = todosSeed[1]._id;
            var text = 'update again';
            request(app)
                .patch(`/todos/${id}`)
                .send({
                    completed: false,
                    text
                })
                .expect(200)
                .expect((res) => {
                    var todo = res.body.todo;
                    expect(todo.text).toBe(text);
                    expect(todo.completed).toBe(false);
                    expect(todo.completedAt).toNotExist();
                })
                .end(done);

            // 200
            // completed == false
            // completedAt is .toNotExist();
        });

    });

});

