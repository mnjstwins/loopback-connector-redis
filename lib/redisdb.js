/**
 * Created by rohitghatol on 3/10/15.
 */

var redis = require('redis'),
  Connector = require('loopback-connector').Connector,
  util = require('util');

var NAME = 'redis';

var client = null;
/**
 * Constructor for Redis connector
 * @param {Object} settings The settings object
 * @param {DataSource} dataSource The data source
 * instance
 * @constructo
 */
var RedisDB = function(dataSource) {
  if (!(this instanceof RedisDB)) {
    return new RedisDB(dataSource);
  }

  Connector.call(this, NAME, dataSource.settings);

  this.name = NAME;
  this.settings = dataSource.settings;


};

util.inherits(RedisDB, Connector);

/**
 * Get the default data type for ID
 * @returns {Function} The default type for ID
 */
RedisDB.prototype.getDefaultIdType = function() {
  return String;
};

/**
 * Connect to the Database
 * @param callback
 */
RedisDB.prototype.connect = function(callback){
  client = redis.createClient(this.settings.port,this.settings.host);

  client.on('connect',function(){
    callback(null,'Ok');

  });
  client.on('error',function(){
    callback('error',null);
  });
  client.on('close',function(){
    callback('close',null);
  });
  client.on('end',function(){
    callback('end',null);
  });

}

RedisDB.prototype.getTypes = function onGetTypes() {
  return ['db', 'nosql', 'redis'];
};

RedisDB.prototype.create = function onCreate(name, data, callback) {

  if (typeof (data) === 'undefined' || typeof (data.id) === 'undefined') {
    return callback(new Error("Missing data or record id (id)"));
  }

  client.hmset(data.id,data,function(err,res){
    callback(err,data.id);
  })

};

RedisDB.prototype.find = function(model,id, callback) {

  client.hgetall(id,function(err,data){
    callback(err,[data]);
  });
};
RedisDB.prototype.findOne = function(id, callback) {
  //console.log('index::findOne', arguments.length, arguments);
  this.find(id, callback);
};
RedisDB.prototype.findById = function(id, callback) {
  //console.log('index::findById', arguments.length, arguments);
  this.find(id, callback)
};

RedisDB.prototype.all = function(model, filter, callback) {
  //console.log('index::all', arguments);

  var filterKeys = Object.keys(filter);
  if (filterKeys && filterKeys.length > 0) {
    var id = (filter.where && filter.where.id) ? filter.where.id : filter.id;
    this.find(model, id, callback);
    return;
  }

  // possibly trying to find a random item
  process.nextTick(function() {
    callback(new Error('This operation is not supported'));
  });


};

module.exports = RedisDB;