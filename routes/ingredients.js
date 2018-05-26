var express = require('express');
var router  = express.Router();
var path    = require('path');
var multer  = require('multer');

// Define storage properties
var storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, 'public/uploads/photos/ingredients/');
    },
    filename: function(req, file, callback) {
    	// name of the file plus date and original extension
        var fname = file.fieldname + '-' + Date.now() + path.extname(file.originalname);
        callback(null, fname);
    }
});
// upload propeties set with storage properties
var upload = multer({ storage : storage});



/* GET Ingredients index. */
router.get('/', function(req, res, next) {
  res.render('ingredients/index', { title: 'Captain Cook' });
});


/* GET ingredients listing. */
router.get('/ingredientlist', function(req, res) {
  var db = req.db;
  var collection = db.get('ingredients');
  collection.find({},{},function(e,docs){
    res.json(docs);
  });
});


/* POST to adduser. */
router.post('/addingredient', upload.single('photo'), function(req, res) {
  var db = req.db;
  var file = req.file;
  var collection = db.get('ingredients');

  console.log(file);

  var ingredient = req.body;
  ingredient.photoname = file.filename;

  collection.insert(req.body, function(err, result){
    res.send(
      (err === null) ? { msg: '' } : { msg: err }
    );
  });
});


/* DELETE to deleteuser. */
router.delete('/deleteingredient/:id', function(req, res) {
  var db = req.db;
  var collection = db.get('ingredients');
  var ingredientToDelete = req.params.id;
  collection.remove({ '_id' : ingredientToDelete }, function(err) {
    res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
  });
});

/* PUT to updateingredient. */
router.put('/updateingredient/:id', function(req, res) {
  var db = req.db;

  var collection = db.get('ingredients');
  var ingredientToUpdate = req.params.id;
  collection.update({ '_id' : ingredientToUpdate }, req.body, function(err, result){
    res.send(
      (err === null) ? { msg: '' } : { msg: err }
    );
  });
});

module.exports = router;
