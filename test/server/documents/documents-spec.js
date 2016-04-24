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
            testUtils.seedTestDocuments(res.body._id);
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

      it('should fetch all documents if the current user is an admin',
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

      it('should only fetch public, user and own documents for non-admins',
        function (done) {
          testUtils
            .createUserByPost({
              username: 'some-user',
              password: 'test',
              email: 'test@test.com'
            })
            .then(function (res) {
              request
                .get('/documents')
                .set('x-access-token', res.body.token)
                .accept('application/json')
                .end(function (err, res) {
                  expect(err).to.be.null;
                  expect(res.status).to.equal(200);
                  expect(res.body).to.be.defined;
                  expect(res.body).to.be.instanceOf(Array)
                    .and.to.have.lengthOf(2);
                  done();
                });
            })
            .catch(done);
        });

      it('should list documents sorted by the date created');
    });

    describe('Test create documents functionality', function () {
      var token;
      before(function (done) {
        testUtils.createUserByPost()
          .then(function (res) {
            token = res.body.token;
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

      it('should create a document', function (done) {
        testUtils.createDocumentByPost(token, testUtils.testDocument)
          .then(function (res) {
            expect(res.status).to.equal(201);
            expect(res.body).to.be.defined;
            expect(res.body.title).to.eql(testUtils.testDocument.title);
            expect(res.body.content).to.eql(testUtils.testDocument.content);
            expect(res.body.createdAt).to.be.defined;
            expect(res.body.role).to.be.defined;
            done();
          })
          .catch(done);
      });
    });

    describe('Test update and delete documents functionality', function () {
      var doc;
      var token;
      before(function (done) {
        testUtils.createUserByPost()
          .then(function (res) {
            token = res.body.token;
            done();
          })
          .catch(done);
      });

      after(function (done) {
        testUtils.destroyTestUsers()
          .then(function () {
            done();
          })
          .catch(done);
      });

      beforeEach(function (done) {
        testUtils.createDocumentByPost(token, testUtils.testDocument)
          .then(function (res) {
            doc = res.body;
            done();
          })
          .catch(done);
      });

      afterEach(function (done) {
        testUtils.destroyTestDocuments();
        done();
      });

      it('should fetch a document', function (done) {
        request
          .get('/documents/' + doc._id)
          .set('x-access-token', token)
          .accept('application/json')
          .end(function (err, res) {
            expect(err).to.be.null;
            expect(res.status).to.equal(200);
            expect(res.body).to.be.defined;
            expect(res.body._id).to.eql(doc._id);
            done();
          });
      });

      it('should update a document', function (done) {
        request
          .put('/documents/' + doc._id)
          .send({
            title: 'Changed title',
            content: 'Some content',
            role: 'owner'
          })
          .set('x-access-token', token)
          .end(function (err, res) {
            expect(err).to.be.null;
            expect(res.status).to.equal(200);
            expect(res.body.title).to.eql('Changed title');
            expect(res.body.content).to.eql('Some content');
            expect(res.body.role.title).to.eql('owner');
            done();
          });
      });

      it('should delete a document', function (done) {
        request
          .delete('/documents/' + doc._id)
          .set('x-access-token', token)
          .end(function (err, res) {
            expect(err).to.be.null;
            expect(res.status).to.equal(204);
            done();
          });
      });
    });
  });
})();
