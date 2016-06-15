/* eslint-disable global-require */

const usersController = require('../controllers').usersController;
const customMiddleware = require('../middleware');

module.exports = (app) => {
  // Return a default response for the root url.
  app.get('/api', (req, res) => {
    res.json({ message: 'Welcome to DocMan' });
  });

  // Create a user
  app.post('/api/users', (req, res, next) => customMiddleware
    .validatePost(req, res, next, {
      requiredFields: ['username', 'email', 'password']
    }
  ), usersController.create);

  // Login a user
  app.post('/api/users/login', (req, res, next) => customMiddleware
    .validatePost(req, res, next, {
      requiredFields: ['username', 'password']
    }
  ), usersController.login);

  /**
   * Beyond this point, only authenticated users should access the API.
   * Unauthenticated users can only either login or register.
   */
  app.use('/api', customMiddleware.authenticate);

  // Users Routes.
  require('./users/users')(app);

  // Documents Routes
  require('./documents/documents')(app);

  // Roles routes>
  require('./roles/roles')(app);
};

/* eslint-enable global-require */
