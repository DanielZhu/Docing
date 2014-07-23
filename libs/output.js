var marked = require('marked');
var hl = require('highlight').Highlight;
var underscore = require('underscore')._;
var fse = require('fs-extra');

var parseMarkdown = function () {

}

var parseHighlight = function () {

}

var writeToFile = function (filename, line) {
  fse.appendFileSync(filename, line, {encoding: 'utf8'});
}

var renderHtml = function (outputList, filePath, filename) {
	var readStream = fse.createReadStream('./template/docTemplate.html', {encoding: 'utf8', autoClose: true});

	readStream.on('data', function(chunk) {
		var compiled = underscore.template(chunk, {_: underscore, hl: hl, mk: marked, splitList: outputList});
		writeToFile(filePath + filename, compiled);
		copyResources(filePath);
  });

}

var copyResources = function (filePath) {
	var cssFile = filePath + 'resources/docing.css';

	fse.copy('./resources', filePath + 'resources', function(err){
	  if (err) return console.error(err);
	  console.log("success!")
	}); //copies directory, even if it has subdirectories or files

	// var resourceExist = fse.existsSync(filePath + 'resources');
	// if (!resourceExist) {
	// 	fse.mkdirSync(filePath + 'resources', '0777');
 //  }
 //  fse.open(cssFile , 'w+', '0777', function(err, fd) {
 //    fse.closeSync(fd);
	// 	var readStream = fse.createReadStream('./resources/docing.css', {encoding: 'utf8', autoClose: true});

	// 	readStream.on('data', function(chunk) {
	// 		writeToFile(cssFile, chunk);
	//   });
 //  });
}

module.exports.renderHtml = renderHtml;
