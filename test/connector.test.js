/**
 * Created by rohitghatol on 3/10/15.
 */
require('./init.js');
var expect = require('chai').expect;

describe('DataSource',function(){
  var ds = null;
  var User = null;

  beforeEach(function(done){
    ds = getDataSource();
    User = ds.define('User', {
      id:{ type:String },
      name: { type: String},
      email: { type: String},
      age: Number
    });
    Project = ds.define('Project', {
      id:{ type:String },
      name: { type: String},
      owner:{ type: String}
    });

    ds.connect(function(err,status){
      expect(err).to.be.null;
      User.destroyAll(function(err){
        expect(err).to.be.null;

        Project.destroyAll(function(err){
          expect(err).to.be.null;
          done();
        });

      });

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

  it('should be able to create User with id',function(done){

    var user1={id:'200',name: 'John'};
    User.create(user1, function (err, user) {
      expect(err).to.be.null;
      expect(user.id).to.equal(user1.id);
      expect(user.name).to.equal(user1.name);
      User.findById('200',function(err,res){
        expect(res.id).to.equal(user1.id);
        expect(res.name).to.equal(user1.name);
        done();
      })

    });
  });

  it('should be able to create User without id',function(done){

    var user1={name: 'John'};
    User.create(user1, function (err, user) {
      expect(err).to.be.null;
      expect(user.id).not.be.null;
      expect(user.name).to.equal(user1.name);
      User.findById(user.id,function(err,res){
        expect(res.id).not.be.null;
        expect(res.name).to.equal(user1.name);
        done();
      })

    });
  });

  it('should be able to destroy User',function(done){

    var user1={id:'200',name: 'John'};
    User.create(user1, function (err, user) {
      expect(err).to.be.null;

      User.findById('200',function(err,user){
        expect(err).to.be.null;
        expect(user.id).to.equal(user1.id);
        expect(user.name).to.equal(user1.name);

        User.deleteById('200',function(err){
          expect(err).to.be.null;
          done();
        });
      })

    });
  });

  it('should be able to destroy all Users',function(done){

    var user1={id:'200',name: 'John'};
    var project1= {id:'100',name:'hr',owner:'Smith'};
    Project.create(project1,function(err,project) {

      User.create(user1, function (err, user) {
        expect(err).to.be.null;

        User.destroyAll(function (err) {
          expect(err).to.be.null;
          Project.findById('100',function(err,project){
            //Check if project still exists
            expect(project.id).to.equal(project1.id);

            //Check the count of Users
            User.count(function(err,count){
              expect(count).to.equal(0);
              done();
            });

          })

        });


      });
    });
  });


  it('should be able to count User',function(done){

    var user1={id:'200',name: 'John'};
    var user2={id:'400',name: 'Bob'};
    User.create(user1, function (err, user) {
      expect(err).to.be.null;

      User.count(function(err,count){
        expect(count).to.equal(1);
        User.create(user2, function (err, user) {
          User.count(function(err,count){
            expect(count).to.equal(2);
            done();
          })
        });
      });

    });
  });

  it('should be able check if key exists',function(done){

    var user1={id:'200',name: 'John'};
    var user2={id:'400',name: 'Bob'};
    User.create(user1, function (err, user) {
      expect(err).to.be.null;
      User.exists('200',function(err,res){
        expect(res).to.equal(true);
        User.create(user2, function (err, user) {
          User.exists('400',function(err,res){
            expect(res).to.equal(true);
            done();
          });
        });

      });

    });
  });

  it('should not be able find a non existent User',function(done){

    User.findById('200',function(err,user){
      expect(user.id).to.be.undefined;
      expect(user.name).to.be.undefined;
      done();
    })

  });

});