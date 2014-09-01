var fs = require('fs');
var path = require('path');

var langPath = path.join(__dirname, "../resources/languages.json");
var langConfigs = null;

console.log(__dirname);
console.log(__filename);

var loadLangConfigs = function () {
  langConfigs = JSON.parse(fs.readFileSync(langPath, 'utf8'));
};

var getLangConfigs = function () {
  return langConfigs;
}

var getLangByName = function (name) {
  return langConfigs[name];
}

var loadLangConfigByExtName = function (extName) {
  loadLangConfigs();
 
  for (var i = 0; i < langConfigs.length; i++) {
    var langItem = langConfigs[i]; 
    var fileExts = langItem.files;
    if (fileExts.length > 0) {
      for (var j = 0; j < fileExts.length; j++) {
        if (extName === fileExts[j]) {
          return langItem;
        }
      };
    }
  };

  return {error: "The language config for this file type cannot be found"};
}

module.exports.loadLangConfigByExtName = loadLangConfigByExtName;