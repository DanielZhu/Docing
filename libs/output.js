var marked = require('marked');
var hljs = require('highlight.js');
var underscore = require('underscore')._;
var fse = require('fs-extra');
var path = require('path');
// var jstree = require('jstree');

var templateContext = '';

var writeToFile = function (filename, line) {
  fse.outputFileSync(filename, line, {encoding: 'utf8'});
};

var renderHtml = function (outputList, langConfig, outputBasePath, relativePath, fileTree) {
  var templatePath = path.join(__dirname, '../template/docTemplate.html');
  var parentTierStr = '';
  
  if (templateContext === '') {
    templateContext = fse.readFileSync(templatePath, {encoding: 'utf8', autoClose: true});
  }

  // var fileTreeHtml = jstree.jstree({ 
  //   'core' : {
  //     'data' : [
  //        'Simple root node',
  //         fileTree
  //     ]
  //   }
  // });

  var outputPath = outputBasePath + relativePath;

  for (var i = 0; i < relativePath.split('/').length - 1; i++) {
    parentTierStr += '../';
  };
  
  var templateHtml = underscore.template(templateContext);
  var compiled = templateHtml({_: underscore, lc: langConfig, hljs: hljs, mk: marked, splitList: outputList, parentTier: parentTierStr/*, ft: fileTreeHtml*/});
  writeToFile(outputPath + '.html', compiled);
  copyResources(outputBasePath);
};

var copyResources = function (docPath) {
  // var cssFile = filePath + 'resources/docing.css';

  //copies directory, even if it has subdirectories or files
  fse.copySync(path.join(__dirname, '../resources'), docPath + '/resources'); 

  // var resourceExist = fse.existsSync(filePath + 'resources');
  // if (!resourceExist) {
  //  fse.mkdirSync(filePath + 'resources', '0777');
 //  }
 //  fse.open(cssFile , 'w+', '0777', function(err, fd) {
 //    fse.closeSync(fd);
  //  var readStream = fse.createReadStream('./resources/docing.css', {encoding: 'utf8', autoClose: true});

  //  readStream.on('data', function(chunk) {
  //    writeToFile(cssFile, chunk);
  //   });
 //  });
};

module.exports.renderHtml = renderHtml;
