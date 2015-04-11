/* global require module PhusionPassenger __dirname process */
(function withModule(require, module) {
  'use strict';

  // from: http://stackoverflow.com/questions/20645231/phusion-passenger-error-http-server-listen-was-called-more-than-once/20645549
  //

  if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'development';
  }

  if (typeof PhusionPassenger !== 'undefined') {
    PhusionPassenger.configure({'autoInstall': false});
  }


  var path = require('path')
    , publicFolder = path.resolve(__dirname, '../..', 'public')
    , Hapi = require('hapi')
    , server = new Hapi.Server();

  server.views({'engines': {'html': require('handlebars')}, 'path': publicFolder});

  module.exports = function exporting() {
    // TODO - pass the right port (conf argument - see below)
    //
    if (typeof PhusionPassenger !== 'undefined') {// Requires Phusion Passenger >= 4.0.52!
      server.connection({'port': '/passenger'});
    } else {
      server.connection(conf);
    }
    // server.connection(conf); // original implementation


    require('./token')(server);
    require('./static-content')(server);

    return server;
  };
}(require, module));
