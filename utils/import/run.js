'use strict';
var crawler = require('calvin-network-tools').crawler;
var mongo = require('../../lib/mongo');

function run(dir, updateTimeslice, callback) {
  crawler(dir, {parseCsv: true}, function(resp){

    mongo.connectForImport('mongodb://localhost:27017/calvin', function(err){
      if( err ) {
        return console.log('Unabled to connect to mongo');
      }

      if( updateTimeslice ) {
        mongo.updateTimeslice(resp.nodes.features, function(err){
          if( err ) {
            return console.log('Unabled to update timeslice: '+JSON.stringify(err));
          }
          aftertimeslice(resp.nodes.features, resp.regions.features, callback);
        });
      } else {
        aftertimeslice(resp.nodes.features, resp.regions.features, callback);
      }

    });
  });
}

function aftertimeslice(nodes, regions, callback) {

  var california = {
    properties : {
      name : 'California',
      id : 'California',
      parents : [],
      nodes : {},
      subregions : []
    }
  };

  regions.forEach(function(r){
    if( r.properties.parents.length === 0 ) {
      california.properties.subregions.push(r.properties.id);
    }
  });

  nodes.forEach(function(n){
    if( n.properties.regions.length === 0 ) {
      california.properties.nodes[n.properties.prmname] = n.properties.type;
    }
  });

  regions.push(california);


  mongo.updateNetwork(nodes, function(err){
    if( err ) {
      return console.log('Unabled to update network: '+JSON.stringify(err));
    }

    mongo.updateRegions(regions, function(err){

      if( err ) {
        return console.log('Unabled to update regions: '+JSON.stringify(err));
      }
      console.log('done.');


        if( callback ) {
          callback('done', true);
        } else {
          process.exit();
        }
      });
  });
}

module.exports = run;
