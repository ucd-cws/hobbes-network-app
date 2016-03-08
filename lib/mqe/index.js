'use strict';

var mqeLib = require('mongo-query-engine');
var processor = require('./processQuery');
var parser = require('./paramParser');
var config = require('../config');

module.exports = function(serverInitConfig, options, callback) {
  var mqeConfig = serverInitConfig.get('mqe');

  mqeConfig.rest.getParamParser = parser;
  options.process = processor;

  mqeLib.init(options, function(){
    config.mqeSetup = mqeLib.getSetup();
    callback();
  });
};
