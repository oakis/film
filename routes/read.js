var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET movie titles */
var filePath = './public/data.json';
var obj;
router.get('/', function (req, res) {
	fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) throw err;
    obj = JSON.parse(data);
    //console.log(obj.film[0].title);
    //console.log(obj.film.length);
    res.render('read', {filmer: obj.film});
  });
});

module.exports = router;
