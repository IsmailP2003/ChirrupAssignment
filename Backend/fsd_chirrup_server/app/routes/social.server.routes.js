const social = require('../controllers/social.server.controllers');
const isAuthenticated = require('../lib/authentication');

module.exports = function(app) {

    app.route('/users/:user_id')
        .get(social.get_user);

    app.route('/users/:user_id/follow')
        .post(isAuthenticated, social.follow_user)
        .delete(isAuthenticated, social.unfollow_user);
    
    app.route('/search')
        .get(social.search_users);

}