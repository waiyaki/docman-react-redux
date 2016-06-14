const Role = require('../models').Role;
const resolveError = require('../utils').resolveError;

function list(req, res) {
  Role.all((err, roles) => {
    if (err) {
      return resolveError(err, res);
    }
    return res.status(200).send(roles);
  });
}

module.exports = {
  list
};
