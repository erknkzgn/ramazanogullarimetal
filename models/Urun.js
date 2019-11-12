var mongoose = require('mongoose');


var UrunSchema = new mongoose.Schema({
	baslik			: String,
	resim 			: String,
	sıra 			: Number,
	text 			: String
});

module.exports = mongoose.model("Urun",UrunSchema);