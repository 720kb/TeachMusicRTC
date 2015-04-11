/* global require module, __dirname*/
(function withModule(require, module, __dirname) {
  'use strict';

  var path = require('path')
    , publicFolder = path.resolve(__dirname, '../..', 'public');
  module.exports = function exporting(server) {

    server.route({
      'method': 'GET',
      'path': '/{param*}',
      'handler': {
        'directory': {
          'path': publicFolder,
          'listing': false
        }
      }
    });
  };
}(require, module, __dirname));
