(function withModule(require) {
  'use strict';

  var server = require('./src/srv/www')({'host': '0.0.0.0', 'port': 3000})
    , wss = require('siglr')();

  server.start(function onStart() {

    console.log('Server running at:', server.info.uri);
  });
}(require));
