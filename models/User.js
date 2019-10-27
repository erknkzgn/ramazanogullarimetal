var mongoose 				= require('mongoose');
var passportLocalMongoose	= require('passport-local-mongoose');


var UserSchema = new mongoose.Schema({
	username    : String,
	email 		: String,
	hakkimizda 	: String,
	adres		: String,
	telefon		: String,
	wtel		: Number,
	password 	: String
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User",UserSchema);