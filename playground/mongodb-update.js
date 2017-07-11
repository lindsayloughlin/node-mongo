
const {MongoClient, ObjectID} = require('mongodb');
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db)=>{

	if (err){
		return console.log('Unable to connect to database');
	}
	console.log('Connected to MongoDB server');


	// db.collection('Todos').findOneAndUpdate({
	// 	_id: new ObjectID('5962d9117b7f914e48cb93d3')
	// 	}, {
	// 		$set: {
	// 			completed: true
	// 		}
	// 	}, {
	// 		returnOriginal: false,
	// 	}).then((result)=>{
	// 		console.log(result);
	// 	});

	//db.collection('Todos').findOne('db.getCollection('Todos').find({_id: ObjectId('5962d9117b7f914e48cb93d3')});')
	db.collection('Users').findOneAndUpdate({_id: new ObjectID('596301d07b7f914e48cba236')},
		{
			$set: {
				name: 'Not lindsay'
			},
			$inc: {
				age: 1
			}
		},
			{
				returnOriginal: false,				
			}
		).then((result)=>{
			console.log('update result' + JSON.stringify(result));
		});
});