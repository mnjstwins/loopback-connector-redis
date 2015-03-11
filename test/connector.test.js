/**
 * Created by rohitghatol on 3/10/15.
 */
require('./init.js');
var expect = require('chai').expect;

describe('DataSource',function(){
  var ds = null;
  var User = null;
  before(function(done){
    ds = getDataSource();
    User = ds.define('User1', {
      id:{ type:String },
      name: { type: String},
      email: { type: String},
      age: Number
    });
    ds.connect(function(err,status){
      expect(err).to.be.null;
      done();
    })
  });


  it('should have redis connector',function(){
    expect(ds).not.null;
    expect(ds.connector).not.null;
    expect(ds.connector.name).to.equal('redis');
    expect(ds.connector.settings).not.null;
    expect(ds.connector.settings.host).not.null;
    expect(ds.connector.settings.port).to.equal(6379);
  });

  it('should be able to create Person',function(done){

    User.create({id:'200',name: 'John'}, function (e, u) {

      User.findById('200',function(err,user){
        console.log(user);
        done();
      })

    });
  });

});