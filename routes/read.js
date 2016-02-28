var express = require('express');
var router = express.Router();
var fs = require('fs');

function checkGenre (query) {
	var arr = [];
	for (film in obj.film) {
		for (typ in obj.film[film].genre) {
			if (obj.film[film].genre[typ] == query) {
				arr.push(obj.film[film]);
			};
		};
	};
	return arr;
};

function titleGenre (query) {
	if (typeof query == 'string') {
		return query;
	} else {
		return 'Alla filmer';
	}
}

/* GET movie titles */
var filePath = './public/data.json';
var obj;
var post;
router.get('/', function (req, res) {
	fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) throw err;
    obj = JSON.parse(data);
    if (req.query.genre == undefined) {
    	post = obj.film;
    } else {
    	post = checkGenre(req.query.genre);
    };
    res.render('read', {filmer: post, title: titleGenre(req.query.genre)});
  });
});

module.exports = router;
