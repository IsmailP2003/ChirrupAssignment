const users = require('../models/user.server.models.js');

const isAuthenticated = function(req,res,next) {
    let token = req.header('X-Authorization');

    users.getIdFromToken(token,(err,id) => {
        if (err || id == null) {
            req.user_id = null;
            return res.sendStatus(401);
        } else {
            req.user_id = id;
        }

    next();
});
};

module.exports = isAuthenticated;