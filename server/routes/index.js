(function () {
  'use strict';

  module.exports = function (app) {
    // Users Routes.
    require('./users/users')(app);

    // Root path.
    app.get('/', function (req, res) {
      res.json({message: 'Welcome to DocMan'});
    });
  };
})();
