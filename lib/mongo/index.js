/**
 * A custom library to establish a database connection
 */
'use strict';
var MongoClient = require('mongodb').MongoClient;
var async = require('async');
var collection, regionCollection, timesliceCollection;
var timeslice = require('./timeslice');
var config = require('../config');

function connect(callback) {
    MongoClient.connect(config.db.url, function(err, db) {
      if( err ) {
        return callback(err);
      }

      config.collections = {
        network : db.collection('network'),
        regions : db.collection('regions'),
        extras : db.collection('extras'),
        timeslice : db.collection('timeslice')
      };

      callback(null, db);
    });
}

function updateRegions(regions, callback) {
  regionCollection.remove({}, function(err, result){
    if( err ) {
      return callback(err);
    }

    async.eachSeries(regions, function(region, next){
      config.collections.regions.insert(region, {w: 1}, function(err, result){
        if( err ) {
          console.log(err);
        }
        next();
      });
    }, callback);
  });
}

module.exports = {
  connect : connect,
  updateRegions : updateRegions,
  updateNetwork : require('./update')
};
