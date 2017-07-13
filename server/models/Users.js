/**
 * Created by lloughlin on 10/7/17.
 */
const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema(
    {
        email: {
            required: true,
            trim: true,
            type: String,
            minlength: 1,
            unique: true,
            validate: {
                validator: validator.isEmail,
                message: '{VALUE} is not a valid email'
            }
        },
        password: {
            type: String,
            required: true,
            minlength: 6
        },
        tokens: [{
            access: {
                type: String,
                required: true
            },
            token: {
                type: String,
                required: true
            },
            date: {
                type: Date,
                required: false,
            }
        }]

    });

    UserSchema.methods.toJSON = function(){
      var user = this;
      var userObject = user.toObject();
      return _.pick(userObject, ['_id', 'email']);
    };

    UserSchema.statics.findByToken = function(token) {
        var User = this;
        var decoded;

        try {
            // abc123 is our secret.
            decoded = jwt.verify(token, 'abc123');
            // console.log('decoded: ', decoded);
        } catch (e) {
            console.log('rejecting', e);
            return Promise.reject();
            // return new Promise((resolve, reject)=>{
            //      reject();
            // });
        }

        console.log('trying find one');
        return User.findOne({
           _id: decoded._id,
            'tokens.token': token,
            'tokens.access' : 'auth'
        });

    };

    UserSchema.statics.findByCredentials = function(email, password) {
        var User = this;
        return User.findOne({email}).then((user)=>{
            //console.log(`found user ${user}`);
            if (!user) {
                return Promise.reject();
            }
            return new Promise((resolve, reject) => {
                bcrypt.compare(password, user.password, (err, correct)=>{
                    if (correct) {
                        resolve(user);
                    }
                    reject();
                });
            });
        });
    };

    UserSchema.methods.removeToken = function(token) {
        var user = this;
        return user.update({
            $pull: {
                tokens: {
                    token: token
                }
            }
        });
    };

    UserSchema.methods.generateAuthToken = function() {
        var user = this;
        var access = 'auth';
        var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

        // could put in push to support more than 1 token.
        user.tokens = [{
            access,
            token,
        }];
        return user.save().then(()=>{
            return token;
        });
    };

    UserSchema.pre('save', function(next){
       var user = this;
       if (user.isModified('password')) {
           bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(user.password, salt, (err, hash) => {
                  user.password = hash;
                  next();
              });
           });

       }else {
           next();
       }

    });

var User = mongoose.model('User',UserSchema);

module.exports = {
    User
};
