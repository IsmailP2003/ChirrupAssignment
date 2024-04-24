const db = require('../../database');
const getSingleUser = (user_id, done) => {
    const sqlUserDetails = `SELECT user_id, first_name, last_name, username
                            FROM users
                            WHERE user_id = ?`;

    db.get(sqlUserDetails, [user_id], (err, user_details) => {
        if (err) {
            console.error('Error fetching user details:', err);
            return done(err);
        }

        if (!user_details) {
            console.log('User details not found for user ID:', user_id);
            return done(404);
        }

        console.log('User details found for user ID:', user_id);

        const sqlFollowers = `SELECT u.user_id, u.first_name, u.last_name, u.username, f.follower_id
                              FROM users u, followers f
                              WHERE f.user_id = ?
                              AND f.follower_id = u.user_id`;

        const sqlFollowing = `SELECT u.user_id, u.first_name, u.last_name, u.username, f.user_id
                              FROM users u, followers f
                              WHERE f.follower_id = ?
                              AND f.user_id = u.user_id`;

        const sqlPosts = `SELECT p.post_id, p.date_published, p.text, u.user_id, u.first_name, u.last_name, u.username
                          FROM posts p, users u
                          WHERE p.author_id = ?
                          AND p.author_id = u.user_id`;
        
        const sqlLikes = `SELECT u.user_id, u.first_name, u.last_name, u.username, l.post_id
                            FROM users u, likes l
                            WHERE l.post_id IN (SELECT post_id FROM posts WHERE author_id = ?)
                            AND l.user_id = u.user_id`;

        const followers = [];
        const following = [];
        const posts = [];

        db.each(sqlFollowers, [user_id], (err, row) => {
            if (err) return done(err);

            followers.push({
                user_id: row.user_id,
                first_name: row.first_name,
                last_name: row.last_name,
                username: row.username
            });
        }, (err, numFollowersRows) => {
            if (err) return done(err);

            db.each(sqlFollowing, [user_id], (err, row) => {
                if (err) return done(err);

                following.push({
                    user_id: row.user_id,
                    first_name: row.first_name,
                    last_name: row.last_name,
                    username: row.username
                });
            }, (err, numFollowingRows) => {
                if (err) return done(err);

                db.all(sqlPosts, [user_id], (err, allPosts) => {
                    console.log('All posts:', allPosts);
                    if (err) return done(err);

                    if (allPosts.length === 0) {
                        return done(null, {
                            user_id: user_details.user_id,
                            first_name: user_details.first_name,
                            last_name: user_details.last_name,
                            username: user_details.username,
                            followers: followers,
                            following: following,
                            posts: posts
                        });
                    }

                    allPosts.forEach(postRow => {
                        db.all(sqlLikes, [postRow.user_id], (err, allLikes) => {
                            if (err) return done(err);
                            

                            const postLikes = allLikes.map(likeRow => ({
                                user_id: likeRow.user_id,
                                first_name: likeRow.first_name,
                                last_name: likeRow.last_name,
                                username: likeRow.username,
                                post_id: likeRow.post_id
                            }));

                            posts.push({
                                post_id: postRow.post_id,
                                timestamp: postRow.date_published,
                                text: postRow.text,
                                author: {
                                    user_id: postRow.user_id,
                                    first_name: postRow.first_name,
                                    last_name: postRow.last_name,
                                    username: postRow.username
                                },
                                likes: postLikes
                            });

                            if (posts.length === allPosts.length) {
                                return done(null, {
                                    user_id: user_details.user_id,
                                    first_name: user_details.first_name,
                                    last_name: user_details.last_name,
                                    username: user_details.username,
                                    followers: followers,
                                    following: following,
                                    posts: posts
                                });
                            }
                        });
                    });
                });
            });
        });
    });
};


const followUser = (user_id, follower_id, done) => {
    const sql = "INSERT INTO followers (user_id, follower_id) VALUES (?, ?)";
    let values = [user_id, follower_id];

    db.run(sql, values, (err) => {
        if (err) return done(err);

        return done(null);
    });
};

const unfollowUser = (user_id, follow_id, done) => {
    const sql = "DELETE FROM followers WHERE user_id=? AND follower_id=?";
    let values = [user_id, follow_id];

    db.run(sql, values, (err) => {
        if (err) return done(err);

        return done(null);
    });
};

const checkIfFollowing = (userId, followerId, done) => {
    
    const userExistsQuery = "SELECT COUNT(*) as count FROM users WHERE user_id=?";
    db.get(userExistsQuery, [userId], (userErr, userRow) => {
        if (userErr) {
            return done(404);
        }

        
        if (userRow.count === 0) {
            return done(404);
        }

        
        const followQuery = "SELECT COUNT(*) as count FROM followers WHERE user_id=? AND follower_id=?";
        db.get(followQuery, [userId, followerId], (followErr, followRow) => {
            if (followErr) {
                return done(followErr);
            }

            
            return done(null, followRow.count > 0);
        });
    });
};

const searchUsers = (searchTerm, done) => {
    const sql = `
        SELECT user_id, first_name, last_name, username
        FROM users
        WHERE first_name LIKE ? OR last_name LIKE ? OR username LIKE ?
    `;
    const values = [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`];

    db.all(sql, values, (err, rows) => {
        if (err) return done(err);

        return done(null, rows);
    });

}

const getAllUsers = (done) => {
    const sql = `SELECT user_id, first_name, last_name, username FROM users`;



    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error('Error fetching all users:', err);
            return done(err, null);
        }

        return done(null, rows); 
    });



};

module.exports = {
    getSingleUser: getSingleUser,
    followUser: followUser,
    unfollowUser: unfollowUser,
    checkIfFollowing: checkIfFollowing,
    searchUsers: searchUsers,
    getAllUsers: getAllUsers
};


