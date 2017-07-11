/**
 * Created by lloughlin on 11/7/17.
 */
const {SHA256} = require('crypto-js');

const jwt = require('jsonwebtoken');

// signed
// jwt.sign
//
// // makes sure token was not manipulated
// jwt.verify

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
