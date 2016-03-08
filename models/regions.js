'use strict';

var config = require('../lib/config');
var collection;


module.exports = function() {
  collection = config.collections.regions;

    return {
        name: 'regions',
        get : getRegions
    };
};

function getRegions(callback) {
  collection.find({}).toArray(callback);
}
