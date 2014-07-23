// #DocIng
// 
// Auto generate documents for your codes. Any language and any format can be covered by DocIng.
// 
// **Author**: DanielZhu(enterzhu@gmail.com)
// **Datae**: 2014/07/19
// 
// Copyright 2014. Zhu Meng Dan

var fs = require('fs');
var path = require('path');
var sys=require('sys');
var split = require('./split');
var output = require('./output');
var lang = require('./lang');

var folderPath = 'C:/staydan.com/libs/';
var filesQueue = [];

// Create the folder if not existing
// {"errno":34,"code":"ENOENT","path":"c:\\staydan.com\\Docing\\docs"}
var createDocFolder = function () {
  fs.readdir(folderPath + '/docs', function(err, files) {
    console.log(JSON.stringify(err));
    if (err !== null) {
      fs.mkdir(folderPath + '/docs', '0777', function() {
        readFiles();
      });
    } else {
      readFiles();
    }
  });
}

var outputHtml = function (i) {
  var filePath = folderPath + '/' + filesQueue[i];
  var extName = path.extname(filePath);
  var fileName = path.basename(filePath, extName);
  var readStream = null;
  var outputList = [];
  var outputFileTree = [];

  fs.stat(filePath, function(err, stats) {
    if (filesQueue.length > 0) {
      if (stats.isFile()) {
        var langConfig = lang.loadLangConfigByExtName(extName);
        if (langConfig.error !== undefined) {
          console.log(langConfig.error);
        } else {
          fs.readFile(filePath, {encoding: 'utf8', autoClose: true}, function (err, data) {
            console.log('got %d bytes of data', data.length);

            outputList = split.splitOutSrc(data, langConfig);
            output.renderHtml(outputList, path.dirname(filePath) + '/docs/', fileName + '.d.html');
            fs.open(path.dirname(filePath) + '/docs/' + fileName + '.d.html', 'w+', '0777', function(err, fd) {
              fs.closeSync(fd);
            });
          });
          // readStream = fs.createReadStream(filePath, {encoding: 'utf8', autoClose: true});

          // readStream.on('data', function(chunk) {
          //   console.log('got %d bytes of data', chunk.length);
          //   outputList = split.splitOutSrc(chunk, extName);
          //   output.renderHtml(outputList, path.dirname(filePath) + '/docs/', fileName + '.d.html');
          // });

          // readStream.on('end', function() {
          //   console.log('there will be no more data.');
          // });
          // fs.readFile(filePath, 'utf8', function(err, data) {
          //   if (err) {
          //     throw err;
          //   }
          //   console.log(data);
          // });
        }
      }
      if (i + 1 < filesQueue.length) {
        outputHtml(i + 1);
      }
    }
  });

};

// Read the directory 'Docing/js/'
var readFiles = function () {
  fs.readdir(folderPath, function(err, files) {
    console.log(JSON.stringify(err));
    console.log(JSON.stringify(files));
    if (err === null) {
      filesQueue = files;
      if (filesQueue.length > 0) {
        outputHtml(0);
      }
    }
  });
}

sys.debug("Starting ...");

createDocFolder();
