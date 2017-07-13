/**
 * Created by lloughlin on 11/7/17.
 */
const {SHA256} = require('crypto-js');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// signed
// jwt.sign
//
// // makes sure token was not manipulated
// jwt.verify

var password = env.process.JWT_SECRET;

bcrypt.genSalt(10, (err, salt)=> {
    console.log(`salt: ${salt}`);
    bcrypt.hash(password, salt, (err, hash)=>{
        console.log('hash: ', hash);
    });
});


var hashedPassword ='$2a$10$aND.vG4yZmzQubf/6iJ8vuVhCgmKLdk24AAAFgvkfrDayL8GhNp8W';
bcrypt.compare(password, hashedPassword, (err, res)=>{
    console.log(res);
});

var data = {
  id: 10
};

var token = jwt.sign(data, '123abc');
console.log(token);

var decoded = jwt.verify(token, '123abc');
console.log(`decoded token`, decoded);

// var messsage = '1 am user number 3';
// var hash = SHA256(messsage).toString();
//
// console.log(`messsage ${hash}`);
//
// var data = {
//     id: 4
// };
//
// var token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// };
//
// // token.data.id = 5;
// // token.data = SHA256(JSON.stringify(token.data)).toString();
//
// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();
// if (resultHash === token.hash){
//     console.log('data was not changed');
// } else {
//     console.log('data was changed, do not trust');
// }
