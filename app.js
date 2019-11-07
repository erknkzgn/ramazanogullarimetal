var express 					= require("express"),
	multer						= require("multer"),
	path						= require("path"),
	app 						= express(),
	mongoose 					= require("mongoose"),
	bodyParser 					= require("body-parser"),
	mongoose 					= require('mongoose'),
	User 						= require('./models/User'),
	Urun 						= require('./models/Urun'),
	Fiyat 						= require('./models/fiyat'),
	IkinciEl 					= require('./models/ikinciEl'),
	methodOverride				= require('method-override'),
	passport					= require('passport'),
	LocalStrategy				= require('passport-local').Strategy,
	passportLocalMongoose		= require('passport-local-mongoose'),
	session 					= require('express-session');
//mongoose.connect('mongodb://localhost/hurdaci', {useNewUrlParser: true});

mongoose.connect('mongodb://erkan:erkn.1212@ds351807.mlab.com:51807/hurdaci', {useNewUrlParser: true});


var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
 console.log("veri tabanına Bağlanıldı")
});
//=====================Bütün Route'larla Paylaşılan Bilgiler=========================
app.use(bodyParser.urlencoded({extended : true}))
app.use(express.static(__dirname + '/public'));
app.use(methodOverride("_method"));
app.set("view engine","ejs");

//======================passport config=================================

app.use(require("express-session")({
	secret :"bu bir express uygulamasıdır",
	resave :false,
	saveUninitialized :true
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next();
});


//================Set Storage Engine===============================

const storage = multer.diskStorage({
  destination: './public/uploads',
  filename: function(req, file, cb){
    cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Init Upload
const upload = multer({
  storage: storage,
  limits:{fileSize: 1000000},
  fileFilter: function(req, file, cb){
    checkFileType(file, cb);
  }
}).single('myImage');

// Check File Type
function checkFileType(file, cb){
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname){
    return cb(null,true);
  } else {
    cb('Error: Images Only!');
  }
}


/*var user = new User({username:"erkan.kzgn@hotmail.com",username:"erknkzgn",password:"1234"});
user.save(function(err,newuser){
	if (err) {
		console.log(err)
	}else console.log(newuser);
})

User.findOne({username : "ramazan"},function(err,founduser){
	if (err) {
		console.log("hata");
	}else console.log(founduser);
})



function kullaniciGirisi(username,password,err){
	User.findOne({username : username},function(err,founduser){
	if (err) {
		console.log("hata");
	}else {
		if (founduser.username == username && founduser.password == password) {
			console.log("giris basarili");
			
		}
	}
})
}*/
//====================AUTH ROUTES===================================

app.post('/giris',passport.authenticate('local', { 
		successRedirect: '/urunBilgileri',
  		failureRedirect: '/kaydol'}),
	function(req,res){

	}
);

app.get('/cikisyap', function(req,res) {
	req.logout();
	res.redirect("/");
});

//=====================KAYIT OL===============================
app.get('/kaydol', function(req,res) {
	res.render("kaydol");
});

app.get('/ikinciElDetay/:id', function(req,res) {
	IkinciEl.findById(req.params.id,function(err,ikinciEl){
		if (err) {
			console.log(err);
		}else{
			res.render("ikinciElDetay" ,{ikinciEl:ikinciEl});
		}
	})
	
});

app.post('/kaydol', function(req,res) {
	var yeniKullanici = new User({username: req.body.username, email: req.body.email});
	User.register(yeniKullanici, req.body.password, function(err,kullanici){
		if (err) {
			console.log(err);
			return res.render("kaydol")
		}
		passport.authenticate("local")(req,res,function(){
			console.log("erkan")
			res.redirect("/");
		});
	});
});

app.post('/resimYukle', (req, res) => {
  upload(req, res, (err) => {
    if(err){
      res.render('ikinciElResim', {
        msg: err
      });
    } else {
      if(req.file == undefined){
        res.render('ikinciElResim', {
          msg: 'Error: No File Selected!'
        });
      } else {
        res.render('ikinciElEkle', {
          msg: 'File Uploaded!',
          file: `/uploads/${req.file.filename}`
        });
      }
    }
  });
});




app.post('/UrunEkle',function(req,res){
	var yeniUrun = new Urun({
	name 			: req.body.name,
	anaUrunGrubu	: req.body.anaUrun,
	fiyat 			: req.body.fiyat,
	resim 			: req.body.resim,
	sıra 			: req.body.sıra,
	text 			: req.body.metin

   });
	Urun.create(yeniUrun,function(err,yeniOlusturulmusUrun){
		if (err) {
			console.log(err);
		}else{
			res.redirect("/urunBilgileri")
		}

	})
  
});

/*app.post('/FiyatEkle',function(req,res){
	var fiyat = new Fiyat({
	bakir 				: 5,
	bakirKirkanbar		: 5,
	sari				: 5,
	sariKirkanbar		: 5,
	cinko 				: 5,
	kirkanbarKablo		: 5,
	AntikronKablo		: 5,
	HurdaAlum			: 5,
	AraisAlum			: 5,
	MatbaaJant			: 5,
	SertAlum			: 5,
	AlümTalasi			: 5,
	AlümBakırliPetek	: 5,
	KutuAlum   			: 5,
	AlumOtoRadyatör		: 5,
	LevhaKursun			: 5,
	Kursun				: 5,
	Aku					: 5,
	KucukAku			: 5,
	Krom				: 5,
	KromTalasi			: 5

   });
	Fiyat.create(fiyat,function(err,yeniOlusturulmusUrun){
		if (err) {
			console.log(err);
		}else{
			res.redirect("/fiyatlar")
		}

	})
  
});*/



app.post('/ikinciElEkle',kullanıcıGirisi, function(req,res){
	var ikinciElUrun = new IkinciEl({
	name 			: req.body.name,
	anaUrunGrubu	: req.body.anaUrun,
	fiyat 			: req.body.fiyat,
	resim 			: req.body.resim,
	sıra 			: req.body.sıra,
	text 			: req.body.metin

   });
	IkinciEl.create(ikinciElUrun,function(err,yeniOlusturulmusUrun){
		if (err) {
			console.log(err);
		}else{
			res.redirect("/urunBilgileri")
		}

	})
  
});



app.put('/urunBilgileri/ikinciEl/:id',kullanıcıGirisi,  function(req,res) {
	IkinciEl.findByIdAndUpdate(req.params.id, req.body.ikinciEl, function(err,urun){
		if (err) {
			console.log(err);
			res.redirect("/")
		}else{
			res.redirect("/urunBilgileri/ikinciEl/"+req.params.id);
		}
	});
});

app.put('/urunBilgileri/fiyat/:id',kullanıcıGirisi,  function(req,res) {
	Fiyat.findByIdAndUpdate(req.params.id, req.body.Fiyat, function(err,urun){
		if (err) {
			console.log(err);
			res.redirect("/")
		}else{
			res.render("elements",{Urun:urun});
		}
	});
});

app.delete('/urunBilgileri/ikinciEl/:id',kullanıcıGirisi,  function(req,res) {
	IkinciEl.findByIdAndRemove(req.params.id,function(err,urun){
		if (err) {
			console.log(err);
			res.redirect("/urunBilgileri")
		}else{
			res.redirect("/urunBilgileri");
		}
	});
});

app.get('/', function(req,res) {
	res.render("index")
	
	
});

app.get('/urunBilgileri', kullanıcıGirisi, function(req,res) {
	Urun.find({},function(err,UrunlerDB){
		if (err) {
			console.log(err);
		}else{
			IkinciEl.find({},function(err,ikinciEl){
				if (err) {
					console.log(err);
				}else{
					Fiyat.find({},function(err,fiyatlar){
				if (err) {
					console.log(err);
				}else{
					User.find({},function(err,users){
				if (err) {
					console.log(err);
				}else{
					res.render("urunBilgileri" ,{ IkinciEller:ikinciEl,Urunler : UrunlerDB,fiyatlar:fiyatlar,Users:users});
				}
				})
				}
				})
			}
			})
			
			
		}
	})
	
	
});

app.get('/urunBilgileri/ikinciElEkle', kullanıcıGirisi,  function(req,res) {
	res.render("ikinciElEkle");
	
});


app.get('/urunBilgileri/:id/ikinciElguncelle', function(req,res) {
	IkinciEl.findById(req.params.id, function(err,urun){
		if (err) {
			console.log(err);
		}else{
			
			res.render("ikinciElGuncelle",{ikinciEl:urun});
		}
	})
});

app.get('/urunBilgileri/ikinciEl/:id', function(req,res) {
	IkinciEl.findById(req.params.id, function(err,urun){
		if (err) {
			console.log(err);
			res.redirect("/")
		}else{
			res.render("urunGoster",{Urun:urun});
		}
	});
});




app.get('/urunBilgileri/ikinciElResim', function(req,res) {
	res.render("ikinciElResim");
	
});


app.get('/urunBilgileri/urunekle',kullanıcıGirisi,  function(req,res) {
	res.render("urunekle");
	
});

app.get('/urunBilgileri/:id/urunguncelle', function(req,res) {
	Urun.findById(req.params.id, function(err,urun){
		if (err) {
			console.log(err);
		}else{
			
			res.render("urunguncelle",{urun:urun});
		}
	})
});

app.get('/urunBilgileri/:id', function(req,res) {
	Urun.findById(req.params.id, function(err,urun){
		if (err) {
			console.log(err);
			res.redirect("/")
		}else{
			res.render("urunGoster",{Urun:urun});
		}
	});
});


app.put('/urunBilgileri/:id', kullanıcıGirisi, function(req,res) {
	Urun.findByIdAndUpdate(req.params.id, req.body.urun, function(err,urun){
		if (err) {
			console.log(err);
			res.redirect("/")
		}else{
			res.redirect("/urunBilgileri/"+req.params.id);
		}
	});
});

app.delete('/urunBilgileri/:id', kullanıcıGirisi,  function(req,res) {
	Urun.findByIdAndRemove(req.params.id,function(err,urun){
		if (err) {
			console.log(err);
			res.redirect("/urunBilgileri")
		}else{
			res.redirect("/urunBilgileri");
		}
	});
});

app.get('/test', function(req,res) {
	Urun.find({},function(err,UrunlerDB){
		if (err) {
			console.log(err);
		}else{
			console.log(UrunlerDB)
			res.render("test",{Urunler : UrunlerDB});
		}
	})
	
	
});


app.get('/hakkimizda', function(req,res) {
	User.findOne({name:"Caner"},function(err,users){
				if (err) {
					console.log(err);
				}else{
					res.render("about-us" ,{user:users});
				}
				})
});

app.get('/urunlerimiz', function(req,res) {
	IkinciEl.find({},function(err,IkinciEl){
		if (err) {
			console.log(err);
		}else{
			res.render("projects", {Urunler:IkinciEl});
		}
	})
	
});



app.get('/UserGuncelle/:id',kullanıcıGirisi,  function(req,res) {
	User.findById(req.params.id,function(err,users){
				if (err) {
					console.log(err);
				}else{
					res.render("UserGuncelle" ,{user:users});
				}
				})
	
});

app.put('/urunBilgileri/UserGuncelle/:id', kullanıcıGirisi,  function(req,res) {
	User.findByIdAndUpdate(req.params.id, req.body.user, function(err,urun){
		if (err) {
			console.log(err);
			res.redirect("/")
		}else{
			res.redirect("/UserGuncelle/"+req.params.id);
		}
	});
});

app.put('/urunBilgileri/UserGuncelle/:id',kullanıcıGirisi,  function(req,res) {
	User.findByIdAndUpdate(req.params.id, req.body.urun, function(err,urun){
		if (err) {
			console.log(err);
			res.redirect("/")
		}else{
			res.redirect("/UserGuncelle/"+req.params.id);
		}
	});
});

app.get('/urunBilgileri/fiyat/:id',kullanıcıGirisi,  function(req,res) {
	Fiyat.findById(req.params.id, function(err,urun){
		if (err) {
			console.log(err);
			res.redirect("/")
		}else{
			res.render("urunGoster",{Urun:urun});
		}
	});
});

app.get('/fiyatlar', function(req,res) {
	Fiyat.findOne({name:"fiyatlar"},function(err,UrunlerDB){
		if (err) {
			console.log(err);
		}else{
			console.log(UrunlerDB)
			res.render("elements",{Urun : UrunlerDB});
		}
	})
	
});

app.get('/FiyatGuncelle/:id',kullanıcıGirisi,  function(req,res) {
	Fiyat.findById(req.params.id,function(err,fiyat){
		if (err) {
			console.log(err)
		}else{
			res.render("FiyatGuncelle" , {Fiyat:fiyat});
		}
	})
	
	
});

app.get('/galeri', function(req,res) {
	Urun.find({}, function(err,urun){
		if (err) {
			console.log(err);
			res.redirect("/")
		}else{
			IkinciEl.find({}, function(err,urun2){
				if (err) {
					console.log(err);
					res.redirect("/")
				}else{
					res.render("galeri",{Urunler2:urun2,Urunler:urun});
				}
			});
			
		}
	});
	
});

app.get('/iletisim', function(req,res) {
	User.findOne({name:"Caner"},function(err,users){
				if (err) {
					console.log(err);
				}else{
					res.render("contact" ,{user:users});
				}
				})

});

//===================Giris-Çıkış işlemleri============================================

app.get('/giris', function(req,res) {
	res.render("giris");
});


function kullanıcıGirisi(req,res,next){
	if (req.isAuthenticated()){
		return next();
	}
	res.redirect("/giris")
}

var PORT = process.env.PORT || 8080
var server = app.listen(PORT,function(req,res){
	console.log("Sunucu portu: %d", server.address().port);
});


