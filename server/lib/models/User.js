var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const schema = new Schema({
	username: {
		type: String,
		required: true,
		unique: true,
		trim: true
	},
	password: {
		type: String,
		required: true
	},
	isAdmin: {
		type: Boolean,
		required: true
	}
})

//Authenticate Users
schema.statics.authenticate = function (username, password, callback) {

    User.findOne({ username: username }).exec(function(err, user) {
        if (err) return callback(err);
        else if (!user) {
            var err = new Error('User does not exist');
            err.status = 401;
            return callback(err);
        }
        bcrypt.compare(password, user.password, function (err, result) {
            if (result === true) {
                //console.log("user " + user + " logged in successfully");
                return callback(null,user);
            } else {
                console.log("incorrect password")
                var err = new Error('Password is incorrect');
                err.status = 401;
                return callback(err);
            }
        })
    });
}

const User = mongoose.model('User', schema);
module.exports = User;