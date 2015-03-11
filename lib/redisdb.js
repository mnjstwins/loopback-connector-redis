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

/**
 * Create a new model instance
 */
RedisDB.prototype.create = function (model, data, callback) {
  if (typeof (data) === 'undefined' || typeof (data.id) === 'undefined') {
    return callback(new Error("Missing data or record id (id)"));
  }

  client.hmset(data.id,data,function(err,res){
    callback(err,data.id);
  })
};

/**
 * Save a model instance
 */
RedisDB.prototype.save = function (model, data, callback) {
  this.create(model,data,callback);
};

/**
 * Check if a model instance exists by id
 */
RedisDB.prototype.exists = function (model, id, callback) {
  if (typeof (data) === 'undefined' || typeof (data.id) === 'undefined') {
    return callback(new Error("Missing data or record id (id)"));
  }
  client.exists('key', function(err, reply) {
    callback(err,reply===1);
  });
};

/**
 * Find a model instance by id
 */
RedisDB.prototype.find = function find(model, id, callback) {
  if (typeof (id) === 'undefined') {
    return callback(new Error("Please specify a cache id"));
  }
  client.hgetall(id,function(err,data){
    callback(err,[data]);
  });

};

/**
 * Update a model instance or create a new model instance if it doesn't exist
 */
RedisDB.prototype.updateOrCreate = function updateOrCreate(model, data, callback) {
  this.create(model,data,callback);
};

/**
 * Delete a model instance by id
 */
RedisDB.prototype.destroy = function destroy(model, id, callback) {
  if (typeof (id) === 'undefined') {
    return callback(new Error("Please specify a cache id"));
  }
  client.del(id,function(err,data){
    callback(err,data);
  })
};

/**
 * Query model instances by the filter
 */
RedisDB.prototype.all = function all(model, filter, callback) {
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

/**
 * Delete all model instances
 */
RedisDB.prototype.destroyAll = function destroyAll(model, data,callback) {
  if (data && data.id) {
    return this.destroy(model, data.id, callback);
  }
  else{
    callback=data;
    client.flushall(callback);
  }

};

/**
 * Count the model instances by the where criteria
 */
RedisDB.prototype.count = function count(model, callback, where) {
  var pattern = where.id || '*';
  client.keys(pattern,function(err,keys){
    callback(err,keys.length);
  });
};

/**
 * Update the attributes for a model instance by id
 */
RedisDB.prototype.updateAttributes = function updateAttrs(model, id, data, callback) {
  if (typeof (id) === 'undefined') {
    return callback(new Error("Please specify a cache id"));
  }
  client.hmset(id,data,function(err,res){
    callback(err,data.id);
  })
};

module.exports = RedisDB;