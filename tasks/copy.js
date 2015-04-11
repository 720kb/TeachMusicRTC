/* global require __dirname */
(function withModule(require, __dirname) {
  'use strict';

  var fs = require('fs-extra')
    , path = require('path')
    , toModule = '../node_modules/'
    , toNewDir = 'public/vendor'
    , materialize = require(toModule + 'materialize-css/package.json').files
    , jQuery = require(toModule + 'jquery/package.json').main
    , materializeIndex = 0
    , pathFrom
    , newFile;

  fs.remove(toNewDir, function onRemove(err) {

    if (err) {

      throw err;
    }

    fs.mkdirpSync(toNewDir);
    for (; materializeIndex < materialize.length; materializeIndex += 1) {

      pathFrom = path.resolve(__dirname, toModule + 'materialize-css/', materialize[materializeIndex]);
      newFile = toNewDir + '/' + materialize[materializeIndex];
      fs.copySync(pathFrom, newFile);
    }

    fs.copySync(path.resolve(__dirname, toModule + 'jquery/', jQuery), toNewDir + '/' + jQuery);
    fs.copySync(path.resolve(__dirname, '../webrtc-adapter/', 'adapter.js'), toNewDir + '/js/adapter.js');
  });
}(require, __dirname));
