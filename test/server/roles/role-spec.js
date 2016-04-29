(function () {
  'use strict';

  // Configure the app with this new env.
  var app = require('../../../app');
  var request = require('supertest')(app);
  var expect = require('chai').expect;
  var Role = require('../../../server/models').Role;
  var testUtils = require('../../helpers/utils');

  describe('Role Test Suite', function () {
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
          expect(roleTitles.sort()).to.eql(defaults.sort());
          done();
        });
    });

    it('should create unique roles', function (done) {
      Role.create({title: 'user'}, function (err, role) {
        expect(err).to.not.be.null;
        expect(role).to.be.undefined;
        expect(err.name).to.equal('MongoError');
        expect(err.code).to.equal(11000);
        expect(err.message).to.match(/duplicate key error/);
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

    it('should fetch all roles', function (done) {
      testUtils.createUserByPost()
        .then(function (response) {
          request
            .get('/api/roles')
            .set('x-access-token', response.body.token)
            .accept('application/json')
            .end(function (err, res) {
              expect(err).to.be.null;
              expect(res.status).to.equal(200);
              expect(res.body).to.be.instanceOf(Array).and.to.have.lengthOf(4);

              var expected = ['public', 'user', 'private', 'admin'];
              var gotten = res.body.map(function (role) {
                return role.title;
              });
              expect(expected.sort()).to.eql(gotten.sort());
              done();
            });
        })
        .catch(done);
    });
  });
})();
