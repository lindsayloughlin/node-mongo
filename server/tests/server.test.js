/**
 * Created by lloughlin on 10/7/17.
 */


const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/Todo');

const todosSeed = [{
    text: 'First test todo'
},{
    text: 'Second test todo'
}];


beforeEach((done) => {
    // wipe everything.
    Todo.remove({}).then(() => {
        return Todo.insertMany(todosSeed);
    }).then(()=> done());
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
    it('should get all todos', (done) =>{
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res)=>{
                expect(res.body.todos.length).toBe(2);
                console.log('done checking length');
            })
            .end(done)
    });
});

