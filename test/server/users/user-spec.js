(function () {
  'use strict';

  process.env.NODE_ENV = 'testing';

  var app = require('../../../app');
  var request = require('supertest')(app);
  var expect = require('chai').expect;
  var User = require('../../../server/models').User;
  var Role = require('../../../server/models').Role;

  describe('User Test Suite:', function () {
    var testData = {
      username: 'test',
      password: 'test-password',
      email: 'test@email.com'
    };

    describe('Test creates unique users', function () {
      before(function (done) {
        request
          .post('/users')
          .send(testData)
          .end(done);
      });

      after(function (done) {
        User.remove({}, done);
      });

      it('should create unique users', function (done) {
        request
          .post('/users')
          .send(testData)
          .end(function (err, res) {
            expect(err).to.be.null;
            expect(res.status).to.equal(400);
            expect(res.body.message)
              .to.match(/A user with this username|email already exists/);
            done();
          });
      });
    });

    describe('Test create user functionality', function () {
      afterEach(function (done) {
        User.remove({}, done);
      });

      it('should create a user', function (done) {
        request
          .post('/users')
          .send(testData)
          .accept('application/json')
          .end(function (err, res) {
            expect(err).to.be.null;
            expect(res.status).to.equal(201);
            expect(res.body).to.be.defined;
            expect(res.body).to.have.property('username', testData.username);
            expect(res.body).to.have.property('email', testData.email);
            done();
          });
      });

      it('should return an auth token when it creates a user', function (done) {
        request
          .post('/users')
          .send(testData)
          .accept('application/json')
          .end(function (err, res) {
            expect(err).to.be.null;
            expect(res.status).to.equal(201);
            expect(res.body.token).to.be.defined;
            done();
          });
      });

      it('should require a password, username and email to create a user',
        function (done) {
          request
            .post('/users')
            .send({})
            .accept('application/json')
            .end(function (err, res) {
              expect(err).to.be.null;
              expect(res.status).to.equal(400);
              expect(res.body).to.be.instanceOf(Array).and.to.have.lengthOf(3);

              res.body.forEach(function (errorObj) {
                var key = Object.keys(errorObj)[0];
                var msg = errorObj[key];
                expect(key).to.match(/username|email|password/);
                expect(msg).to.eql('This field is required.');
              });
              done();
            });
        });

      it('should create a user with first and last names when provided',
        function (done) {
          var tData = Object.assign({}, testData, {
            first_name: 'Test',
            last_name: 'User'
          });

          request
            .post('/users')
            .send(tData)
            .accept('application/json')
            .end(function (err, res) {
              expect(err).to.be.null;
              expect(res.status).to.equal(201);
              expect(res.body.name).to.be.defined;
              expect(res.body.name)
                .to.have.property('first_name', tData.first_name);
              expect(res.body.name)
                .to.have.property('last_name', tData.last_name);
              done();
            });
        });

      it('should create a user with a role defined', function (done) {
        request
          .post('/users')
          .send(testData)
          .accept('application/json')
          .end(function (err, res) {
            expect(err).to.be.null;
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
        request
          .post('/users')
          .send(testData)
          .end(function (err, res) { // eslint-disable-line
            token = res.body.token;
            done();
          });
      });

      after(function (done) {
        User.remove({}, done);
      });

      it('should login a user with a username/password and return a token',
        function (done) {
          request
            .post('/users/login')
            .send({
              username: testData.username,
              password: testData.password
            })
            .accept('application/json')
            .end(function (err, res) {
              expect(err).to.be.null;
              expect(res.status).to.equal(200);
              expect(res.body.message).to.match(
                /Authentication successful/);
              expect(res.body.token).to.be.defined;
              done();
            });
        });

      it('should require a password and username to login', function (done) {
        request
          .post('/users/login')
          .send({})
          .accept('application/json')
          .end(function (err, res) {
            expect(err).to.be.null;
            expect(res.status).to.equal(400);
            expect(res.body).to.be.instanceOf(Array).and.to.have.lengthOf(2);

            res.body.forEach(function (errorObj) {
              var key = Object.keys(errorObj)[0];
              var msg = errorObj[key];
              expect(key).to.match(/username|password/);
              expect(msg).to.eql('This field is required.');
            });
            done();
          });
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
      var userId;
      var role;
      before(function (done) {
        Role.findOne({ title: 'admin' }).exec(function (err, _role) {
          if (err) throw err;
          role = _role;
        });
        request
          .post('/users')
          .send(testData)
          .accept('application/json')
          .end(function (err, res) { // eslint-disable-line
            token = res.body.token;
            userId = res.body._id;
            done();
          });
      });

      after(function (done) {
        User.remove({}, done);
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
        User
          .findOneAndUpdate({ _id: userId }, { $set: { role: role._id } })
          .exec(function (err, user) { // eslint-disable-line
            request
              .get('/users')
              .set('x-access-token', token)
              .accept('application/json')
              .end(function (err, res) {
                expect(err).to.be.null;
                expect(res.status).to.equal(200);
                expect(res.body).to.be.instanceOf(Array)
                  .and.to.have.lengthOf(1);
                done();
              });
          });
      });
    });
  });
})();
