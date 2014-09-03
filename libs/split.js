// var fse = require('fs-extra');

// [
//  {'code': ', 'comment': '},
//  {'code': ', 'comment': '},
//  {'code': ', 'comment': '}
// ]

var outputList = [];

var resetItem = function () {
  return new Object({'comment': '', 'code': ''});
};

// Find the nearest comment position
var findCommentPosition = function (fileData, symbol, ignoreTime) {
  // Set the ignore time default to 0
  if (ignoreTime === undefined) {
    ignoreTime = 0;
  }

  // find the correct start symbol at the right position
  var startAt = fileData.indexOf(symbol);
  for (var i = 0; i < ignoreTime; i++) {
    startAt = fileData.indexOf(symbol, startAt + symbol.length + 1);
  };

  var cutFileDataTilCommentStart = fileData.substring(0, startAt);
  var singleQuotaPos = cutFileDataTilCommentStart.indexOf('\'');
  var doubleQuotaPos = cutFileDataTilCommentStart.indexOf('\"');
  var dirturb = '';
  var quotaArr = [], quotaCount = 0;
  // quota count
  if (singleQuotaPos > doubleQuotaPos && singleQuotaPos > 0) {
    dirturb = '\'';
    quotaArr = cutFileDataTilCommentStart.match(/\'/g);  
  } else if (singleQuotaPos < doubleQuotaPos && doubleQuotaPos > 0) {
    dirturb = '\"';
    quotaArr = cutFileDataTilCommentStart.match(/\"/g);  
  }

  quotaCount = quotaArr.length;
  if (quotaCount % 2 === 0) {
    // The symbol is standalone
    return startAt;
  } else {
    // The symbol is bewteen the quota, should find the next one.
    return findCommentPosition(fileData, symbol, ignoreTime + 1);
  }
};

var splitOutSrc = function (fileData, langConfig) {
  outputList = [];
  var item = resetItem();

  var commentFommat = langConfig.comments;
  var previousCommStart = null;

  while (fileData.length > 0) {

    var commStartMin = -1;
    var commentIndex = -1;
    var commStart = '';
    var commEndIndexOf;
    
    for (var i = 0; i < commentFommat.length; i++) {
      commStart = commentFommat[i][0];

      var commStartIndexOf = findCommentPosition(fileData, commStart);

      if (commStartIndexOf < commStartMin || commStartMin === -1) {
        commStartMin = commStartIndexOf;
        commentIndex = i;
      }
    }
    
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
        item.comment += '  \n' + comment;

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
      // Reach the end of the file
      if (fileData.length === 0) {
          outputList.push(item);
          break;
      }
      previousCommStart = commStart;
    }
  }

  // fse.writeFileSync('C:/staydan.com/libs/docs/log.json', JSON.stringify(outputList), {encoding: 'utf8'});
  return outputList;
};

var readLine = function (fileData) {
  loadLangConfig();
  console.log('Readline start...');
  var lineIndexOf = fileData.indexOf('\r\n');
  var startAt = 0;
  var endAt = lineIndexOf;
  var line = '';

  while (lineIndexOf !== -1) {
    line = fileData.substring(startAt, endAt);
    fileData = fileData.substring(endAt + 4);
    lineIndexOf = fileData.indexOf('\r\n');
    endAt = lineIndexOf;
  }
  console.log('Readline end...');
};

module.exports.readLine = readLine;
module.exports.splitOutSrc = splitOutSrc;