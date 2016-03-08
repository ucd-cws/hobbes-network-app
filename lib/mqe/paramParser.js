'use strict';

var config = require('../config');

module.exports = function(query) {
  if( query.id ) {
    return {'_id': query.id };
  } else if ( query[config.id] ) {
    var q = {};
    q['properties.'+config.id] = query[config.id];
    return q;
  }
  return {'_id': query._id};
};
