const db = require("../../database");

const getUserPost = (user_id, done) => {
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

        const sqlPosts = `SELECT p.post_id, p.date_published, p.text, u.user_id, u.first_name, u.last_name, u.username
                          FROM posts p, users u
                          WHERE p.author_id = ?
                          AND p.author_id = u.user_id`;

        const sqlLikes = `SELECT u.user_id, u.first_name, u.last_name, u.username, l.post_id
                            FROM users u, likes l
                            WHERE l.post_id IN (SELECT post_id FROM posts WHERE author_id = ?)
                            AND l.user_id = u.user_id`;

        const posts = [];

        db.all(sqlPosts, [user_id], (err, allPosts) => {
            console.log('All posts:', allPosts);
            if (err) return done(err);

            if (allPosts.length === 0) {
                
                return done(null, posts);
            }

            let count = 0;

            allPosts.forEach(postRow => {
                db.all(sqlLikes, [postRow.post_id], (err, allLikes) => {
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

                    count++;

                    if (count === allPosts.length) {
                        return done(null, posts);
                    }
                });
            });
        });
    });
};


const getFeed = (user_id, done) => {
    const sql = `SELECT f.user_id
                 FROM followers f
                 WHERE f.follower_id = ?`;

    db.all(sql, [user_id], (err, followings) => {
        if (err) {
            console.error('Error fetching followings:', err);
            return done(err);
        }

        const usersData = [];

        
        getUserPost(user_id, (err, userData) => {
            if (err) {
                console.error('Error fetching user details:', err);
                return done(err);
            }

            usersData.push(userData);

            
            let count = 0;

            if (followings.length === 0) {
                return done(null, usersData.flat());
            }

            followings.forEach(following => {
                console.log('Following:', following);
                getUserPost(following.user_id, (err, followingData) => {
                    if (err) {
                        console.error('Error fetching following details:', err);
                        return done(err);
                    }

                    usersData.push(followingData);

                    count++;
                    console.log('Count:', count);

                    if (count === followings.length) {
                        done(null, usersData.flat());
                    }
                });
            });
        });
    });
};





getPublicFeed = (done) => {
    const sqlPosts = `SELECT p.post_id, p.date_published, p.text, u.user_id, u.first_name, u.last_name, u.username
                     FROM posts p, users u
                     WHERE p.author_id = u.user_id
                     ORDER BY p.date_published DESC`;

    const sqlLikes = `SELECT u.user_id, u.first_name, u.last_name, u.username, l.post_id
                   FROM users u, likes l
                   WHERE l.post_id IN (SELECT post_id FROM posts WHERE post_id = ?)
                   AND l.user_id = u.user_id`;

    db.all(sqlPosts, [], (err, posts) => {
        if (err) {
            console.error('Error fetching public feed posts:', err);
            return done(err);
        }

        if (!posts || posts.length === 0) {
            console.log('No posts found');
            return done(null, []);
        }

        let count = 0;
        const resultPosts = [];

        posts.forEach(postRow => {
            db.all(sqlLikes, [postRow.post_id], (err, allLikes) => {
                if (err) {
                    console.error('Error fetching likes for post:', err);
                    return done(err);
                }

                const postLikes = allLikes.map(likeRow => ({
                    user_id: likeRow.user_id,
                    first_name: likeRow.first_name,
                    last_name: likeRow.last_name,
                    username: likeRow.username,
                    post_id: likeRow.post_id
                }));

                resultPosts.push({
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

                count++;

                if (count === posts.length) {
                    return done(null, resultPosts);
                }
            });
        });
    });
};


module.exports = {
    getFeed: getFeed,
    getPublicFeed: getPublicFeed
};

