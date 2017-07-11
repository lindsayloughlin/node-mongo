/**
 * Created by lloughlin on 10/7/17.
 */


const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');


const {app} = require('./../server');
const {Todo} = require('./../models/Todo');

const todosSeed = [{
    text: 'First test todo',
    _id: new ObjectID()
}, {
    text: 'Second test todo',
    _id: new ObjectID()
}];


beforeEach((done) => {
    // wipe everything.
    Todo.remove({}).then(() => {
        return Todo.insertMany(todosSeed);
    }).then(() => done());
});

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
                    Todo.findById(hexId).then((todo) =>{
                        console.log(`json item ${JSON.stringify(todo)}`);
                        expect(todo).toNotExist();
                        done();
                    }).catch((e)=> done(e));
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

});

