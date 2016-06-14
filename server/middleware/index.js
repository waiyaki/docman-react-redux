const jwt = require('jsonwebtoken');
const appConfig = require('../config/config');
const User = require('../models').User;

/**
 * Validate POST request data.
 */
const validatePost = (req, res, next, options) => {
  const requiredFields = options.requiredFields;
  const errors = [];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!req.body[field]) {
      errors.push({
        [field]: 'This field is required.'
      });
    }
  }
  if (errors.length) {
    return res.status(400).send(errors);
  }
  return next();
};

/**
 * Ensure the request has an auth token before allowing API access
 */
const authenticate = (req, res, next) => {
  const token = req.body.token ||
    req.params.token ||
    req.headers['x-access-token'];

  if (!token) {
    return res.status(401).send({
      message: 'No access token provided.'
    });
  }

  return jwt.verify(token, appConfig.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: 'Failed to authenticate token.'
      });
    }

    return User
      .findById({ _id: decoded._id })
      .exec((err, user) => {
        if (err) {
          return next(err);
        }
        if (!user) {
          // Probably using a token whose user's been deleted.
          return res.status(401).send({
            message: 'Invalid token. Please try logging in again.'
          });
        }
        req.decoded = user; //eslint-disable-line
        return next();
      });
  });
};

/**
 * Allow only admins to interact with the upcoming endpoint.
 * Has to be used after the `authenticate` middleware.
 */
const isAdminOrOwnProfile = (req, res, next) => User
  .findOne({ _id: req.decoded._id })
  .populate('role', 'title')
  .exec((err, user) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      // Maybe we have an invalid token? User deleted? :thinking_face:
      return res.status(401).send({
        message: 'Invalid token. Please try logging in again.'
      });
    }
    if (user.role && user.role.title === 'admin') {
      // Allow admins access to all profiles.
      return next();
    } else if (req.params && (
        req.params.usernameOrId === user.username ||
        req.params.usernameOrId === user._id.toString()
      )) {
      // Allow users access to their own profiles.
      return next();
    }
    return res.status(403).send({
      message: 'Admin access level required.'
    });
  });

module.exports = {
  authenticate,
  isAdminOrOwnProfile,
  validatePost
};
