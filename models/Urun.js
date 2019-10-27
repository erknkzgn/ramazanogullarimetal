var mongoose = require('mongoose');


var UrunSchema = new mongoose.Schema({
	name 			: String,
	fiyat 			: String,
	resim 			: String,
	anaUrunGrubu	: String,
	sıra 			: Number,
	text 			: String
});

module.exports = mongoose.model("Urun",UrunSchema);