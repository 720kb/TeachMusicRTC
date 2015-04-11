/* global require __dirname */
(function withModule(require, __dirname) {
  'use strict';

  var fs = require('fs-extra')
    , path = require('path')
    , toModule = '../node_modules/'
    , toNewDir = 'public/vendor'
    , materialize = require(toModule + 'materialize-css/package.json').files
    , jQuery = require(toModule + 'jquery/package.json').main
    , sglr = require(toModule + 'siglr/package.json').files
    , anIndex = 0
    , pathFrom
    , newFile;

  fs.remove(toNewDir, function onRemove(err) {

    if (err) {

      throw err;
    }

    fs.mkdirpSync(toNewDir);
    for (; anIndex < materialize.length; anIndex += 1) {

      pathFrom = path.resolve(__dirname, toModule + 'materialize-css/', materialize[anIndex]);
      newFile = toNewDir + '/' + materialize[anIndex];
      fs.copySync(pathFrom, newFile);
    }

    for (anIndex = 0; anIndex < sglr.length; anIndex += 1) {

      if (sglr[anIndex] !== 'index.js') {

        pathFrom = path.resolve(__dirname, toModule + 'siglr/', sglr[anIndex]);
        newFile = toNewDir + '/' + sglr[anIndex];
        fs.copySync(pathFrom, newFile);
      }
    }

    fs.copySync(path.resolve(__dirname, toModule + 'jquery/', jQuery), toNewDir + '/' + jQuery);
    fs.copySync(path.resolve(__dirname, '../webrtc-adapter/', 'adapter.js'), toNewDir + '/js/adapter.js');
  });
}(require, __dirname));
