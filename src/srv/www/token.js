/* global require module */
(function withModule(require, module) {
  'use strict';

  module.exports = function exporting(server) {

    server.route({
      'method': 'GET',
      'path': '/token',
      'handler': function handler(request, reply) {
        var user = parseInt(Math.random() * 100000000, 10);
        reply(user);
      }
    });
  };
}(require, module));
