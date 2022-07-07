const mongoose = require ('mongoose');

var UserSchema = mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	
});


var User = module.exports = mongoose.model('User', UserSchema);