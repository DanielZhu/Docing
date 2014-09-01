var fse = require('fs-extra');

// [
//  {"code": "", "comment": ""},
//  {"code": "", "comment": ""},
//  {"code": "", "comment": ""}
// ]

var outputList = [];

var resetItem = function () {
  return new Object({"comment": "", "code": ""});
}

var splitOutSrc = function (fileData, langConfig) {
  outputList = [];
  var item = resetItem();

  var commentFommat = langConfig.comments;
  var previousCommStart = null;

  while (fileData.length > 0) {

    var commStartMin = -1;
    var commentIndex = -1;
    var commStart = "";
    for (var i = 0; i < commentFommat.length; i++) {
      commStart = commentFommat[i][0];

      var commStartIndexOf = fileData.indexOf(commStart);

      if (commStartIndexOf < commStartMin || commStartMin === -1) {
        commStartMin = commStartIndexOf;
        commentIndex = i;
      }
    };
    
    var commEnd = commentFommat[commentIndex][1];
    commStart = commentFommat[commentIndex][0];

    if (commStartMin === -1) {
      item.code = fileData;
      outputList.push(item);
      item = resetItem();
      break;
    } else {
      // The comment end of '\n'
      if (commEnd === '\n' && fileData.substring(0, commStartMin).trim().length === 0) {
        // Remove all the empty texts
       
        if (previousCommStart !== commStart) {
          if (fileData.substring(0, commStartMin).trim().length !== 0) {
            item.code = fileData.substring(0, commStartMin);
          }
          outputList.push(item);
          item = resetItem();
        }

        fileData = fileData.substring(commStartMin);
        commEndIndexOf = fileData.indexOf(commEnd);
        
        // Store the comment block
        var comment = fileData.substring(commStart.length, commEndIndexOf + commEnd.length);
        item.comment += "  \n" + comment;

      } else {
        if (fileData.substring(0, commStartMin).trim().length !== 0) {
          item.code = fileData.substring(0, commStartMin);
          outputList.push(item);
          item = resetItem();
        }
        fileData = fileData.substring(commStartMin);
        // Found the comment start
        commEndIndexOf = fileData.indexOf(commEnd);
        // Store the comment block, and break it
        var comment = fileData.substring(commStart.length, commEndIndexOf);
        if (comment.trim().length === 0) {
          resetItem();
        } else {
          item.comment = comment;
        }
      }
      fileData = fileData.substring(commEndIndexOf + commEnd.length);
      previousCommStart = commStart;
    }
  }

  // fse.writeFileSync('C:/staydan.com/libs/docs/log.json', JSON.stringify(outputList), {encoding: 'utf8'});
  return outputList;
}

var readLine = function (fileData) {
  loadLangConfig();
  console.log('Readline start...');
  var lineIndexOf = fileData.indexOf('\r\n');
  var startAt = 0;
  var endAt = lineIndexOf;
  var line = '';
  var i = 0;

  while (lineIndexOf !== -1) {
    line = fileData.substring(startAt, endAt);
    // writeToFile(filename, i++ + ': ' + line);
    // console.log(i + ': ' + line);
    fileData = fileData.substring(endAt + 4);
    lineIndexOf = fileData.indexOf('\r\n');
    endAt = lineIndexOf;
  }
  console.log('Readline end...');
}

module.exports.readLine = readLine;
module.exports.splitOutSrc = splitOutSrc;