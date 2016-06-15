const rolesController = require('../../controllers').rolesController;

module.exports = (app) => {
  /**
   * List all roles in the system..
   */
  app.get('/api/roles', rolesController.list);
};
