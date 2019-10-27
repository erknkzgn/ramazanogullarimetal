var mongoose = require('mongoose');


var FiyatSchema = new mongoose.Schema({
	name				: String,
	bakir 				: String,
	bakirKirkanbar		: String,
	sari				: String,
	sariKirkanbar		: String,
	cinko 				: String,
	kirkanbarKablo		: String,
	AntikronKablo		: String,
	HurdaAlum			: String,
	AraisAlum			: String,
	MatbaaJant			: String,
	SertAlum			: String,
	AlumTalasi			: String,
	AlumBakırliPetek	: String,
	KutuAlum   			: String,
	AlumOtoRadyatör		: String,
	LevhaKursun			: String,
	Kursun				: String,
	Aku					: String,
	KucukAku			: String,
	Krom				: String,
	KromTalasi			: String
});

module.exports = mongoose.model("Fiyat",FiyatSchema);