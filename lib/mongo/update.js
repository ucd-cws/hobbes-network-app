'use strict';

var async = require('async');
var config = require('../config');

var init = false;
var network, extras;
var extraProperties = config.extras;

function updateNetwork(nodes, callback) {
  if( !init ) {
    network = config.collections.network;
    extras = config.collections.extras;
  }

  clearNetwork(function(err){
    if( err ) {
      return callback(err);
    }

    async.eachSeries(nodes, function(node, next){
      enforce(node); // make sure basic things are apart of node and not null
      var outputItem = splitOutput(node);

      if( outputItem !== null ) {
        insert(extras, outputItem, function(){
          insert(network, node, next);
        });
      } else {
        insert(network, node, next);
      }

    }, callback);

  });
}

function splitOutput(node) {
  var extraData = {
    id : node.properties[config.id]
  };
  var extraReference = {};

  extraProperties.forEach(function(prop){
    if( node.properties[prop] !== undefined && node.properties[prop] !== null ) {
      extraData[prop] = node.properties[prop];
      extraReference[prop] = true;
      delete node.properties[prop];
    }
  });

  if( Object.keys(extraReference).length > 0 ) {
    if( !node.properties.hobbes ) {
      node.properties.hobbes.extras = {};
    }
    node.properties.hobbes.extras = extraReference;
    return extraData;
  }

  return null;
}

function clearNetwork(callback) {
  network.remove({}, function(err, result){
    if( err ) {
      return callback(err);
    }
    extras.remove({}, function(err, result){
      if( err ) {
        return callback(err);
      }
      callback();
    });
  });
}

function insert(collection, item, next) {
  network.insert(item, {w: 1}, function(err, result){
    if( err ) {
      console.log(err);
    }
    next();
  });
}

function enforce(node) {
  if( !node.properties ) {
    node.properties = {};
  }

  if( node.properties.id ) {
    node.properties.id = '_not_set_';
  }
}

module.exports = updateNetwork;
