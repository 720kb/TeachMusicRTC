/* global require module PhusionPassenger*/
(function withModule(require, module) {
  'use strict';

  // from: http://stackoverflow.com/questions/20645231/phusion-passenger-error-http-server-listen-was-called-more-than-once/20645549
  //

  if (typeof PhusionPassenger !== 'undefined') {
    PhusionPassenger.configure({'autoInstall': false});
  }

  var Hapi = require('hapi')
    , server = new Hapi.Server();


  module.exports = function exporting() { // conf

    if (typeof PhusionPassenger !== 'undefined') {// Requires Phusion Passenger >= 4.0.52!
      server.connection({'port': '/passenger'});
    } else {
      server.connection({'port': 3000, 'host': 'localhost'});
    }
    // server.connection(conf); // original implementation


    require('./token')(server);
    require('./static-content')(server);

    return server;
  };
}(require, module));
