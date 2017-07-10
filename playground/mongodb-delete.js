const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err,db)=>{
	if (err) {
		return console.log('Unable to connect to MongoDB server');
	}
	console.log('Connected to MongoDB server');
	// db.collection('Todos').findOneAndDelete({ completed: false}).then((result)=>{
	// 	console.log(result);
	// });
	// db.collection('Users').deleteMany({ text: 'Linds'});
	console.log('deleted linds');
	// db.collection('Users').findOneAndDelete({ _id: new ObjectID('5962c92c22a64d5b47cb6d82')}).then((results)=>{
	// 	console.log(JSON.stringify(results));
	// });
});