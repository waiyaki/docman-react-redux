(function () {
  'use strict';

  process.env.NODE_ENV = 'testing';
  var app = require('../../../app');
  var request = require('supertest')(app);
  var User = require('../../../server/models/users');

  describe('User Test Suite:', function () {
    var testData = {
      username: 'test',
      password: 'test-password',
      email: 'test@email.com'
    };

    beforeAll(function (done) {
      User.remove({}, done);
    });

    describe('Test creates unique users', function () {
      beforeAll(function (done) {
        request
          .post('/users')
          .send(testData)
          .end(done);
      });

      afterAll(function (done) {
        User.remove({}, done);
      });

      it('should create unique users', function (done) {
        request
          .post('/users')
          .send(testData)
          .end(function (err, res) {
            expect(err).toBeNull();
            expect(res.status).toBe(400);
            expect(res.body.message)
              .toEqual(jasmine.stringMatching(
                /A user with this username|email already exists/));
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
            expect(err).toBeNull();
            expect(res.status).toBe(201);
            expect(res.body).toBeDefined();
            expect(res.body).toEqual(jasmine.objectContaining({
              username: testData.username,
              email: testData.email
            }));
            done();
          });
      });

      it('should return an auth token when it creates a user', function (done) {
        request
          .post('/users')
          .send(testData)
          .accept('application/json')
          .end(function (err, res) {
            expect(err).toBeNull();
            expect(res.status).toBe(201);
            expect(res.body.token).toBeDefined();
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
            expect(err).toBeNull();
            expect(res.status).toBe(400);
            expect(res.body).toEqual({
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
            expect(err).toBeNull();
            expect(res.status).toBe(400);
            expect(res.body).toEqual({
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
            expect(err).toBeNull();
            expect(res.status).toBe(400);
            expect(res.body).toEqual({
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
              expect(err).toBeNull();
              expect(res.status).toBe(201);
              expect(res.body.name).toBeDefined();
              expect(res.body.name).toEqual({
                first_name: tData.first_name,
                last_name: tData.last_name
              });
              done();
            });
        });
    });
  });
})();
