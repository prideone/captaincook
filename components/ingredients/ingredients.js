const express = require('express');
const router  = express.Router();
const path    = require('path');
const multer  = require('multer');

// Define storage properties
let storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, 'public/uploads/photos/ingredients/');
    },
    filename: function(req, file, callback) {
    	// name of the file plus date and original extension
        let fname = file.fieldname + '-' + Date.now() + path.extname(file.originalname);
        callback(null, fname);
    }
});
// upload propeties set with storage properties
let upload = multer({ storage : storage});



/* GET Ingredients index. */
router.get('/', function(req, res, next) {
  res.render('ingredients/index', { title: 'Captain Cook' });
});


/* GET ingredients listing. */
router.get('/ingredientlist', function(req, res) {
  let db = req.db;
  let collection = db.get('ingredients');
  collection.find({},{},function(e,docs){
    res.json(docs);
  });
});


/* POST to add an ingredient. */
router.post('/addingredient', upload.single('photo'), function(req, res) {
  let db = req.db;
  let file = req.file;
  let collection = db.get('ingredients');

  let ingredient = req.body;
  ingredient.photoname = file.filename;

  collection.insert(req.body, function(err, result){
    res.send(
      (err === null) ? { msg: '' } : { msg: err }
    );
  });

  console.log('Add new ingredient : ' + ingredient.name);
});


/* DELETE to delete ingredient. */
router.delete('/deleteingredient/:id', function(req, res) {
  let db = req.db;
  let collection = db.get('ingredients');
  let ingredientToDelete = req.params.id;
  collection.remove({ '_id' : ingredientToDelete }, function(err) {
    res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
  });
});

/* PUT to updateingredient. */
router.put('/updateingredient/:id', function(req, res) {
  let db = req.db;

  let collection = db.get('ingredients');
  let ingredientToUpdate = req.params.id;
  collection.update({ '_id' : ingredientToUpdate }, req.body, function(err, result){
    res.send(
      (err === null) ? { msg: '' } : { msg: err }
    );
  });
});

module.exports = router;
