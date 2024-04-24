const users = require('../controllers/user.server.controllers.js');
const isAuthenticated = require('../lib/authentication.js');

module.exports = function(app){

    app.route('/users')
    .post(users.add_user);

    app.route('/login')
    .post(users.login);

    app.route('/logout')
    .post(isAuthenticated, users.logout);

}