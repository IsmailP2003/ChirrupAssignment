const db = require("../../database");


const addNewPost = (post, author_id, done) => {
    const sql = 'INSERT INTO posts (text, date_published, author_id) VALUES (?, ?, ?)';
    let values = [post.text, Date.now(), author_id];

    db.run(sql, values, function(err){
        if(err) return done(err);
        return done(null, this.lastID);
    })
}

const getSinglePost = (post_id, done) => {
    const sql = `SELECT p.post_id, p.date_published, p.text, u.user_id, u.first_name, u.last_name, u.username 
                FROM posts p, users u 
                WHERE p.post_id=?
                AND p.author_id = u.user_id`;


    db.get(sql, [post_id], function(err, post_details) {
        if (err) {
            console.error('Error fetching post details:', err); 
            return done(err);
        }
        if (!post_details) {
            console.log('Post details not found for post ID:', post_id); 
            return done(404);
        }

        const sql = `SELECT u.user_id, u.first_name, u.last_name, u.username
                        FROM users u, likes l
                        WHERE l.post_id=?
                        AND l.user_id=u.user_id`;

        const likes = [];

        db.each(
            sql,
            [post_id],
            (err, row) => {
                if (err) return done(err);

                likes.push({
                    user_id: row.user_id,
                    first_name: row.first_name,
                    last_name: row.last_name,
                    username: row.username
                });
            },
            (err, num_rows) => {
                if (err) return done(err);

                return done(null, {
                    post_id: post_details.post_id,
                    timestamp: post_details.date_published,
                    text: post_details.text,
                    author: {
                        user_id: post_details.user_id,
                        first_name: post_details.first_name,
                        last_name: post_details.last_name,
                        username: post_details.username
                    },
                    likes: likes
                });
            }
        );
    });
};

const updatePost = (post_id, new_text, done) => {
    const sql = "UPDATE posts SET text=? WHERE post_id=?";
    let values = [new_text, post_id];

    db.run(sql, values, (err) =>{
        
        return done(err);
    });
};

const deletePost = (post_id, done) => {
    const sql = "DELETE FROM posts WHERE post_id=?";
    let values = [post_id];

    db.run(sql, values, (err) =>{
        
        return done(err);
    });
};

const alreadyLiked = (post_id, user_id, done) => {
    const sql = "SELECT COUNT(*) AS count FROM likes WHERE post_id=? AND user_id=?";
    const values = [post_id, user_id];

    db.get(sql, values, function(err, row) {
        if (err) {
            return done(err);
        }
        const count = row ? row.count : 0;  t
        const hasLiked = count > 0; 
        
        
        return done(null, hasLiked);
    });
};

const addLike = (post_id, user_id, done) => {

    const sql = "INSERT INTO likes (post_id, user_id) VALUES (?, ?)";
    let values = [post_id, user_id];

    db.run(sql, values, (err) =>{           
            return done(err);
        });
}

const removeLike = (post_id, user_id, done) => {

    const sql = "DELETE FROM likes WHERE post_id=? AND user_id=?";
    let values = [post_id, user_id];

    db.run(sql, values, (err) =>{           
            return done(err);
        });
}

module.exports = {
    addNewPost: addNewPost,
    getSinglePost: getSinglePost,
    updatePost: updatePost,
    deletePost: deletePost,
    alreadyLiked: alreadyLiked,
    addLike: addLike,
    removeLike: removeLike
};
