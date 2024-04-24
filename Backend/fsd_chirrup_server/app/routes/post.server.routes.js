const posts = require('../controllers/post.server.controllers')
const isAuthenticated = require('../lib/authentication')

module.exports = function(app) {
    app.route('/posts')
        .post(isAuthenticated, posts.add_post); 

    app.route('/posts/:post_id')
        .get( posts.get_post)
        .patch(isAuthenticated, posts.update_post)
        .delete(isAuthenticated, posts.delete_post);

    app.route('/posts/:post_id/like')
        .post(isAuthenticated, posts.add_like)
        .delete(isAuthenticated, posts.remove_like);
};