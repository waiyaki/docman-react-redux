(function () {
  'use strict';

  process.env.NODE_ENV = 'testing';

  // Configure the app with this new env.
  require('../../../app');
  var expect = require('chai').expect;
  var Role = require('../../../server/models').Role;

  describe('Role Test Suite', function () {
    it('should create a new default user role', function () {
      Role.create({}, function (err, role) {
        expect(err).to.be.null;
        expect(role._id).to.be.defined;
        expect(role.title).to.equal('user');
      });
    });

    it('should create all predefined roles when initialized', function (done) {
      var defaults = Role.schema.paths.title.enumValues;
      Role
        .find({}, function (err, roles) {
          if (err) {
            done(err);
          }
          var roleTitles = roles.map(function (role) {
            return role.title;
          });
          expect(roleTitles).to.eql(defaults);
          done();
        });
    });

    it('should create unique roles', function (done) {
      Role.create({title: 'user'}, function (err, role) {
        expect(err).to.not.be.null;
        expect(role).to.be.undefined;
        expect(err.name).to.equal('MongoError');
        expect(err.code).to.equal(11000);
        expect(err.message).to.match(/E11000 duplicate key error collection/);
        done();
      });
    });

    it('should return all roles when Roles.all is called', function (done) {
      Role.all(function (err, roles) {
        expect(err).to.be.null;
        expect(roles).to.be.instanceOf(Array).and.to.have.lengthOf(4);
        done();
      });
    });
  });
})();
