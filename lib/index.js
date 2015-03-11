/**
 * Created by rohitghatol on 3/10/15.
 */

'use strict'

var RedisDB = require('./redisdb');


/**
 * Initialize the Redis connector for the given data source
 * @param {DataSource} dataSource The data source instance
 * @param {Function} [callback] The callback function
 */
exports.initialize = function initializeDataSource(dataSource, callback) {
  var settings = dataSource.settings;
  var connector = new RedisDB(dataSource);

  dataSource.connector = connector;
  connector.dataSource = dataSource;

  if(callback){
    connector.connect(callback);
  }
};