var mongoose = require('mongoose');


var ikinciElSchema = new mongoose.Schema({
	name 			: String,
	fiyat 			: String,
	resim 			: String,
	text 			: String
});

module.exports = mongoose.model("ikinciEl",ikinciElSchema);