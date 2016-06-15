const User = require('./users');
const Role = require('./roles');
const Document = require('./documents');

Role.initialize(); // Create default roles.

module.exports = { User, Role, Document };
