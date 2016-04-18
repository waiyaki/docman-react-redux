(function () {
  'use strict';

  process.env.NODE_ENV = 'testing';

  var app = require('../../../app');
  var request = require('supertest')(app);
  var expect = require('chai').expect;
  var User = require('../../../server/models/users');

  describe('User Test Suite:', function () {
    var testData = {
      username: 'test',
      password: 'test-password',
      email: 'test@email.com'
    };

    before(function (done) {
      User.remove({}, done);
    });

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

    describe('Test user functionality', function () {
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

      it('should require username to create a user', function (done) {
        request
          .post('/users')
          .send({
            email: testData.email,
            password: testData.password
          })
          .accept('application/json')
          .end(function (err, res) {
            expect(err).to.be.null;
            expect(res.status).to.equal(400);
            expect(res.body).to.eql({
              username: 'This field is required.'
            });
            done();
          });
      });

      it('should require email to create a user', function (done) {
        request
          .post('/users')
          .send({
            username: testData.username,
            password: testData.password
          })
          .accept('application/json')
          .end(function (err, res) {
            expect(err).to.be.null;
            expect(res.status).to.equal(400);
            expect(res.body).to.eql({
              email: 'This field is required.'
            });
            done();
          });
      });

      it('should require password to create a user', function (done) {
        request
          .post('/users')
          .send({
            email: testData.email,
            username: testData.username
          })
          .accept('application/json')
          .end(function (err, res) {
            expect(err).to.be.null;
            expect(res.status).to.equal(400);
            expect(res.body).to.eql({
              password: 'This field is required.'
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
  });
})();
