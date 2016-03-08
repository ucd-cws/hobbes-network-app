'use strict';

var async = require('async');
var config = require('../config');

var data = {};
var minMax = {};

function updateTimeslice(nodes, callback) {
  data = {};
  minMax = {};
  var timesliceCollection = config.collections.timeslice;

  console.log('*** UPDATING Timeslice ***');

  if( !config.timesliceFn || typeof config.timesliceFn !== 'function' ) {
    return console.log('You must provide a timeslide function in your config file!\nTimeslice collection not updated');
  }

  console.log('Processing...');
  for( var i = 0; i < nodes.length; i++ ) {
    config.timesliceFn(nodes[i], addTimesliceData);
  }

  console.log('Updating timeslice Collection...');
  timesliceCollection.remove({}, function(err,resp){
    if( err ) {
      return callback(err);
    }

    var keys = Object.keys(data);

    var c = 0;
    async.eachSeries(keys, function(date, next) {
      timesliceCollection.insert({date: date, data: data[date]}, next);
      delete data[date];
    }, function(err){
      console.log('Done with timeslice update.');
      minMax.is = 'minMax';
      timesliceCollection.insert(minMax, callback);
    });
  });
}

function addTimesliceData(name, timeseriesData, node) {
  _addTimesliceData(name, timeseriesData, node.geometry.coordinates, node.properties[config.id]);
}

function _addTimesliceData(type, dataArray, coords, id) {
  if( !dataArray ) {
    return;
  }
  var row, i;

  for( i = 0; i < dataArray.length; i++ ) {
    row = dataArray[i];

    if( typeof row[1] === 'string' ) {
      continue;
    }

    if( row[1] === 0 ) {
      continue;
    }

    var entry = getGeojson(coords, id, type, row[1]);
    var date = row[0].replace(/-\d\d$/,'');

    // update min / max
    if( !minMax[type] ) {
      minMax[type] = {
        min : row[1],
        max : row[1]
      };
    }
    if ( minMax[type].min > row[1] ) {
      minMax[type].min = row[1];
    }
    if ( minMax[type].max < row[1] ) {
      minMax[type].max = row[1];
    }

    if( !data[date] ) {
      data[date] = [];
    }
    data[date].push(entry);
  }
}

function getGeojson(coords, id, type, value) {
  var geo;
  if( typeof coords[0] === 'number' ) {
    geo = {
      geometry : {
        type : 'Point',
        coordinates : coords
      },
      properties : {
        id : id,
        type : type
      }
    };
    geo.properties[type] = value;
    return JSON.stringify(geo);
  }

  geo = {
    geometry : {
      type : 'LineString',
      coordinates : coords
    },
    properties : {
      id : id,
      type : type
    }
  };
  geo.properties[type] = value;
  return JSON.stringify(geo);
}

function trim(num) {
  return Number(num.toFixed(4));
}
