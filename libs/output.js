var marked = require('marked');
var fs = require('fs');
var hl = require('highlight').Highlight;
var underscore = require('underscore')._;

var parseMarkdown = function () {

}

var parseHighlight = function () {

}

var writeToFile = function (filename, line) {
  fs.appendFileSync(filename, line, {encoding: 'utf8'});
}

var renderHtml = function (outputList, filePath, filename) {
	var readStream = fs.createReadStream('./template/docTemplate.html', {encoding: 'utf8', autoClose: true});

	readStream.on('data', function(chunk) {
		var compiled = underscore.template(chunk, {_: underscore, hl: hl, splitList: outputList});
		writeToFile(filePath + filename, compiled);
		copyResources(filePath);
  });

}

var copyResources = function (filePath) {
	var cssFile = filePath + 'resources/docing.css';
	var resourceExist = fs.existsSync(filePath + 'resources');

	if (!resourceExist) {
		fs.mkdirSync(filePath + 'resources', '0777');
  }
  fs.open(cssFile , 'w+', '0777', function(err, fd) {
    fs.closeSync(fd);
		var readStream = fs.createReadStream('./resources/docing.css', {encoding: 'utf8', autoClose: true});

		readStream.on('data', function(chunk) {
			writeToFile(cssFile, chunk);
	  });
  });
}

module.exports.renderHtml = renderHtml;
