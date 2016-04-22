(function () {
  'use strict';

  process.env.NODE_ENV = 'testing';

  var app = require('../../../app');
  var request = require('supertest')(app);
  var expect = require('chai').expect;
  var testUtils = require('../../helpers/utils');

  describe('User Test Suite:', function () {
    describe('Test creates unique users', function () {
      before(function (done) {
        testUtils.createUserByPost(testUtils.testUserData)
          .then(function () {
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

      it('should create unique users', function (done) {
        testUtils.createUserByPost(testUtils.testUserData)
          .then(function (res) {
            expect(res.status).to.equal(400);
            expect(res.body.message)
              .to.match(/A user with this username|email already exists/);
            done();
          })
          .catch(done);
      });
    });

    describe('Test create user functionality', function () {
      afterEach(function (done) {
        testUtils.destroyTestUsers()
          .then(function () {
            done();
          })
          .catch(done);
      });

      it('should create a user', function (done) {
        testUtils.createUserByPost(testUtils.testUserData)
          .then(function (res) {
            expect(res.status).to.equal(201);
            expect(res.body).to.be.defined;
            expect(res.body).to.have.property('username', testUtils.testUserData.username);
            expect(res.body).to.have.property('email', testUtils.testUserData.email);
            done();
          })
          .catch(done);
      });

      it('should return an auth token when it creates a user', function (done) {
        testUtils.createUserByPost()
          .then(function (res) {
            expect(res.status).to.equal(201);
            expect(res.body.token).to.be.defined;
            done();
          })
          .catch(done);
      });

      it('should require a password, username and email to create a user',
        function (done) {
          testUtils.createUserByPost({})
            .then(function (res) {
              expect(res.status).to.equal(400);
              expect(res.body).to.be.instanceOf(Array).and.to.have.lengthOf(3);

              res.body.forEach(function (errorObj) {
                var key = Object.keys(errorObj)[0];
                var msg = errorObj[key];
                expect(key).to.match(/username|email|password/);
                expect(msg).to.eql('This field is required.');
              });
              done();
            })
            .catch(done);
        });

      it('should create a user with first and last names when provided',
        function (done) {
          var tData = Object.assign({}, testUtils.testUserData, {
            first_name: 'Test',
            last_name: 'User'
          });
          testUtils.createUserByPost(tData)
            .then(function (res) {
              expect(res.status).to.equal(201);
              expect(res.body.name).to.be.defined;
              expect(res.body.name)
                .to.have.property('first_name', tData.first_name);
              expect(res.body.name)
                .to.have.property('last_name', tData.last_name);
              done();
            })
            .catch(done);
        });

      it('should create a user with a role defined', function (done) {
        testUtils.createUserByPost()
          .then(function (res) {
            expect(res.status).to.equal(201);
            expect(res.body.role).to.be.defined;
            expect(res.body.role).to.have.all.keys(['_id', 'title']);
            done();
          });
      });
    });

    describe('Test user authentication functionality', function () {
      var token;
      before(function (done) {
        testUtils.createUserByPost(testUtils.testUserData)
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

      it('should login a user with a username/password and return a token',
        function (done) {
          testUtils.login(testUtils.testUserData)
            .then(function (res) {
              expect(res.status).to.equal(200);
              expect(res.body.message).to.match(
                /Authentication successful/);
              expect(res.body.token).to.be.defined;
              done();
            })
            .catch(function (err) {
              done(err);
            });
        });

      it('should require a password and username to login', function (done) {
        testUtils.login({})
          .then(function (res) {
            expect(res.status).to.equal(400);
            expect(res.body).to.be.instanceOf(Array).and.to.have.lengthOf(2);

            res.body.forEach(function (errorObj) {
              var key = Object.keys(errorObj)[0];
              var msg = errorObj[key];
              expect(key).to.match(/username|password/);
              expect(msg).to.eql('This field is required.');
            });
            done();
          })
          .catch(done);
      });

      it('should restrict access to the API if no token is not provided',
        function (done) {
          request
            .get('/users/some/non-existent/route')
            .accept('application/json')
            .end(function (err, res) {
              expect(err).to.be.null;
              expect(res.status).to.equal(401);
              expect(res.body.message).to.eql('No access token provided.');
              done();
            });
        });

      it('should disallow requests with invalid tokens', function (done) {
        request
          .get('/users/some/non-existent/route')
          .accept('application/json')
          .set('x-access-token', 'somerandomthing')
          .end(function (err, res) {
            expect(err).to.be.null;
            expect(res.status).to.equal(401);
            expect(res.body.message).to.eql('Failed to authenticate token.');
            done();
          });
      });

      it('should allow access to requests with valid tokens', function (done) {
        request
          .get('/some/non-existent/route')
          .set('x-access-token', token)
          .accept('application/json')
          .end(function (err, res) {
            expect(err).to.be.null;
            expect(res.status).to.equal(404);
            expect(res.body.message).to.eql('Not Found.');
            done();
          });
      });
    });

    describe('Test get all users functionality', function () {
      var token;
      before(function (done) {
        testUtils.seedTestUsers()
          .then(function () {
            testUtils.createUserByPost(testUtils.testUserData)
              .then(function (res) {
                token = res.body.token;
                done();
              })
              .catch(done);
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

      it('should forbid access to non-admins', function (done) {
        request
          .get('/users')
          .set('x-access-token', token)
          .accept('application/json')
          .end(function (err, res) {
            expect(err).to.be.null;
            expect(res.status).to.equal(403);
            expect(res.body.message).to.eql('Admin access level required.');
            done();
          });
      });

      it('should allow access to admins', function (done) {
        testUtils.makeAdmin(testUtils.testUserData.username)
          .then(function () {
            request
              .get('/users')
              .set('x-access-token', token)
              .accept('application/json')
              .end(function (err, res) {
                expect(err).to.be.null;
                expect(res.status).to.equal(200);
                expect(res.body).to.be.instanceOf(Array)
                  .and.to.have.lengthOf(4);
                done();
              });
          });
      });
    });
  });
})();
