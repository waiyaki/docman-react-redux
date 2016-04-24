(function () {
  'use strict';

  process.env.NODE_ENV = 'testing';

  var app = require('../../../app');
  var request = require('supertest')(app);
  var expect = require('chai').expect;
  var testUtils = require('../../helpers/utils');

  describe('Documents Test Suite', function () {
    describe('Test documents listing functionality', function () {
      var token;
      before(function (done) {
        testUtils.createUserByPost()
          .then(function (res) {
            token = res.body.token;
            testUtils.seedTestDocuments();
            done();
          })
          .catch(done);
      });

      after(function (done) {
        testUtils.destroyTestUsers()
          .then(function () {
            testUtils.destroyTestDocuments();
            done();
          })
          .catch(done);
      });

      it('should fetch all documents accessible to the logged in user',
        function (done) {
          testUtils.makeAdmin()
            .then(function () {
              request
                .get('/documents')
                .set('x-access-token', token)
                .end(function (err, res) {
                  expect(err).to.be.null;
                  expect(res.status).to.equal(200);
                  expect(res.body).to.be.defined;
                  expect(res.body).to.be.instanceOf(Array).and.to.have.lengthOf(4);
                  done();
                });
            })
            .catch(done);
        });
    });
  });
})();
