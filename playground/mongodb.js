const {MongoClient, ObjectID} = require('mongodb');


var user = {name: 'Lindsay',  age: 25};
var {name} = user;

var obj = new ObjectID();
console.log(`obj has new id ${obj}`);

console.log(`deconstructed ${name} from ${JSON.stringify(user)}`);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db)=>{
	if (err) {
		console.log('unable to connect to mango db');
		return;
	}
	console.log('Connected to MongoDb server');
	// db.collection('Todos').insertOne({
	// 	text: 'Something to do',
	// 	completed: false
	// }, (err, result)=> {
	// 	if (err) {
	// 		return console.log('Unable to insert todo', err);
	// 	}
	// 	console.log(JSON.stringify(result.ops, undefined, 2));
	// });
	// db.close();

	
	db.collection('Users').insertOne({
		text: 'Linds',
		age: '35',
		location: 'Melbourne'				
	}, (err, result) => {
		if(err) {
			console.log('failed to enter result');
			return cosole.log('Unable to insert user', err);
		}
		console.log(JSON.stringify(result.ops, undefined, 2));

	});
	db.close();
});
