const feed = require('../controllers/feed.server.controllers');
const users = require('../models/user.server.models.js');

const isAuthenticated = function(req, res, next) {
  let token = req.header('X-Authorization');

  users.getIdFromToken(token, (err, id) => {
    if (err || id == null) {
      req.user_id = null;
    } else {
      req.user_id = id;
    }

    next(); 
  });
};

module.exports = function(app) {
  app.route('/feed').get(isAuthenticated, (req, res, next) => {
    
    
    if (req.user_id !== null && req.user_id !== undefined) {
        console.log('User ID from token:', req.user_id);
      
      feed.get_feed(req, res);
    } else {
      
      feed.get_public_feed(req, res);
    }
  });
};
