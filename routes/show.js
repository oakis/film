var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET movie info */
var filePath = './public/data.json';
var obj;
router.get('/:title'.replace(/ /g,''), function (req, res) {
	fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) throw err;
    obj = JSON.parse(data);
    var fixurl = req.path.replace(/\//g,'');
    for (var i = 0; i < obj.film.length; i++) {
    	if (obj.film[i].title.replace(/ /g,'') == fixurl) {
    		var title = obj.film[i].title;
    		var rating = obj.film[i].imdbRating;
    		var plot = obj.film[i].plot;
    		var director = obj.film[i].director;
    		var movieLength = obj.film[i].movieLength;
            if (typeof obj.film[i].genre == 'string') {
    		  var genre = obj.film[i].genre;
            } else {
              var genre = obj.film[i].genre.join(', ');
            }
            var image = obj.film[i].image;
    	}
    }
    res.render('show', { title: title, rating: rating, plot: plot, director: director, movieLength: movieLength, genre: genre, image: image });
  });
});

module.exports = router;
