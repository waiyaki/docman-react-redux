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

      it('should list documents sorted by the date created', function (done) {
        request
          .get('/documents')
          .set('x-access-token', token)
          .accept('application/json')
          .end(function (err, res) {
            expect(err).to.be.null;

            var sorted = Object.assign([], res.body);
            sorted = sorted.sort(function (a, b) {
              return a.createdAt < b.createdAt;
            });
            expect(res.body).to.eql(sorted);
            done();
          });
      });
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

    describe('Document Search Suite', function () {
      // User variables.
      var user1;
      var user2;

      // Date variables.
      var created = new Date();
      var created_max = created.toISOString().replace(/T.*/g, '');
      var created_min = created.setDate(created.getDate() - 2);
      created_min = new Date(created_min).toISOString().replace(/T.*/g, '');

      before(function (done) {
        testUtils.createUserByPost()
          .then(function (res) {
            user1 = res.body;
            testUtils.createUserByPost({
              username: 'Another',
              password: 'test',
              email: 'test@another.com'
            }).then(function (response) {
              user2 = response.body;
              testUtils.seedTestDocuments(user1._id)
                .then(function () {
                  testUtils.backDateDocumentCreatedAt()
                    .then(function () {
                      done();
                    })
                    .catch(done);
                })
                .catch(done);
            })
              .catch(done);
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

      it('should correctly filter listed documents by role', function (done) {
        request
          .get('/documents?role=user')
          .set('x-access-token', user1.token)
          .accept('application/json')
          .end(function (err, res) {
            expect(err).to.be.null;
            expect(res.status).to.equal(200);
            expect(res.body).to.be.instanceOf(Array).and.to.have.lengthOf(1);
            expect(res.body[0].role.title).to.eql('user');
            done();
          });
      });

      it('should correctly limit the listed documents', function (done) {
        request
          .get('/documents?limit=2')
          .set('x-access-token', user1.token)
          .accept('application/json')
          .end(function (err, res) {
            expect(err).to.be.null;
            expect(res.status).to.equal(200);
            expect(res.body).to.be.instanceOf(Array).and.to.have.lengthOf(2);
            done();
          });
      });

      it('should correctly filter listed documents by user', function (done) {
        request
          .get('/documents?user=' + user1.username)
          .set('x-access-token', user1.token)
          .accept('application/json')
          .end(function (err, res) {
            expect(err).to.be.null;
            expect(res.status).to.equal(200);
            expect(res.body).to.be.instanceOf(Array).and.to.have.lengthOf(4);
          });

        request
          .get('/documents?user=' + user2.username)
          .set('x-access-token', user1.token)
          .accept('application/json')
          .end(function (err, res) {
            expect(err).to.be.null;
            expect(res.status).to.equal(200);
            expect(res.body).to.be.instanceOf(Array).and.to.have.lengthOf(0);
            done();
          });
      });

      it('should correctly filter listed documents by date created',
        function (done) {
          request
            .get('/documents?created=' + created_min)
            .set('x-access-token', user1.token)
            .accept('application/json')
            .end(function (err, res) {
              expect(err).to.be.null;
              expect(res.status).to.equal(200);
              expect(res.body).to.be.instanceOf(Array).and.to.have.lengthOf(1);
              done();
            });
        });

      it('should correctly filter listed documents by date range',
        function (done) {
          var query = '?created_min=' + created_min +
            '&created_max=' + created_max;
          request
            .get('/documents' + query)
            .set('x-access-token', user1.token)
            .accept('application/json')
            .end(function (err, res) {
              expect(err).to.be.null;
              expect(res.status).to.equal(200);
              expect(res.body).to.be.instanceOf(Array).and.to.have.lengthOf(3);
              done();
            });
        });
      it('should correctly filter documents by a combination of filters',
        function (done) {
          var query = '?created_min=' + created_min +
            '&created_max=' + created_max;
          var q1 = query + '&limit=2&user=' + user1.username;
          var q2 = query + '&role=owner&user=' + user2.username;
          request
            .get('/documents' + q1)
            .set('x-access-token', user1.token)
            .accept('application/json')
            .end(function (err, res) {
              expect(err).to.be.null;
              expect(res.status).to.equal(200);
              expect(res.body).to.be.instanceOf(Array).and.to.have.lengthOf(2);
            });
          request
            .get('/documents' + q2)
            .set('x-access-token', user1.token)
            .accept('application/json')
            .end(function (err, res) {
              expect(err).to.be.null;
              expect(res.status).to.equal(200);
              expect(res.body).to.be.instanceOf(Array).and.to.have.lengthOf(0);
              done();
            });
        });
    });
  });
})();
