var redis = require('redis');

    var client = redis.createClient(6379,'192.168.59.103');

    client.on('connect',function(){
      console.log('Ha Ha');
    })
