'use strict';
var express = require('express');
var kraken = require('kraken-js');
var http = require('http');

var db = require('./lib/mongo');
var mqe = require('./lib/mqe');
var devCon = require('./lib/dev');
var config = require('./lib/config');

var options, server, logger, krakenConfig;
var root, appConfig;
var app = express();

module.exports = function(ac) {

  appConfig = ac;
  root = appConfig.root;

  return {
    app : app,
    express : express,
    config : config,
    start : start
  };
};

function start(onStart) {
  /*
   * Create and configure application. Also exports application instance for use by tests.
   * See https://github.com/krakenjs/kraken-js#options for additional configuration options.
   */
  options = {
      onconfig: function (kc, next) {
        krakenConfig = kc;

        config.db = krakenConfig.get('mqe').db;

        // command line override of mqe config
        if( krakenConfig.get('mqe-local') ) {
          krakenConfig.use(require(krakenConfig.get('mqe-local')));
        }

        db.connect(function(err, database) {

          mqe(krakenConfig, {
              config: krakenConfig.get('mqe'),
              app: app,
              express: express,
              mongo: database
            }, function(setup){
              logger = config.mqeSetup.logger;

              /*
               * Add any additional config setup or overrides here. `config` is an initialized
               * `confit` (https://github.com/krakenjs/confit/) configuration object.
               */
              next(null, krakenConfig);
              onReady(krakenConfig);
          });

        });
      }
  };

  /*
   * Create and start HTTP server.
   */
  function onReady(krakenConfig) {
    server = http.createServer(app);

    if( krakenConfig.get('dev') || appConfig.dev ) {
      app.use(express.static(__dirname+'/public'));
      devCon.init(server, app);
    } else {
      devCon.prod(app);
    }

    server.listen(krakenConfig.get('mqe').server.localport || process.env.PORT || 8000);
    server.on('listening', function () {
        logger.info('Server listening on http://localhost:%d', this.address().port);
    });

    if( onStart ) {
      onStart();
    }
  }

  app.on('start', function () {
      logger.info('Application ready to serve requests.');
      logger.info('Environment: %s', app.kraken.get('env:env'));

  });

  app.use(kraken(options));
}
