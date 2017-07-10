const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
	if (err) {
		return console.log('Unable to connect to MongoDB server');
	}

	console.log('connect to MongoDB');

	// db.collection('Todos').find({ 
	// 	_id: new ObjectID('595f29dcaa0d31448fe8a03a') 
	// }

	
	db.collection('Todos').find({ name: 'Lindsay'}).toArray().then((docs) => {			
		console.log('Docs for Lindsay ' + JSON.stringify(docs, undefined, 2));
	}, (err) => {
		
		console.log('Unable to get todos');
	});

	db.close();
})