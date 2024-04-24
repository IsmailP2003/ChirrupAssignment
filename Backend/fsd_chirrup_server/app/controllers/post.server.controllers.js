const posts = require("../models/post.server.models");
const Joi = require("joi");

const add_post = (req, res) => {
    const scheme = Joi.object({
        text: Joi.string().required()
    });

    const {error} = scheme.validate(req.body); 
    if (error) {
        return res.status(400).send(`Validation error: ${error.details[0].message}`);
    }

    let post = Object.assign({}, req.body);
    posts.addNewPost(post,req.user_id, (err, id) => {
        if (err) {
            console.error('Error adding post:', err);
            return res.sendStatus(500);
        } else {
            console.log('Post added successfully with ID:', id);
            return res.status(201).json({ post_id : id }); 
        }
    });

};

const get_post = (req, res) => {
    let post_id = parseInt(req.params.post_id);
    console.log('Received GET request for post ID:', post_id);

    posts.getSinglePost(post_id, (err, result) => {
        if (err) {
            if (err === 404) {
                return res.status(404).send('Post not found');
            } else {
                return res.sendStatus(500);
            }
        }
        
        return res.status(200).send(result);
    });
};

const update_post = (req, res) => {
    let post_id = parseInt(req.params.post_id);

    posts.getSinglePost(post_id, (err,post) => {
        if (err === 404) return res.sendStatus(404);
        if(err) return res.sendStatus(500);

        const loggedInUserId = req.user_id; 
        const author_id = post.author.user_id; 
    
        console.log("User ID:", loggedInUserId, "attempted to edit post ID:", post_id, "owned by user ID:", author_id);
    
        if (loggedInUserId !== author_id) {
           
            return res.status(403).send("Unauthorized: You cannot edit this post.");
        }

        const scheme = Joi.object({
            "text": Joi.string().required()
        });

        const {error} = scheme.validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        if (post.text === req.body.text) {
            return res.sendStatus(200);
        }

        posts.updatePost(post_id, req.body.text, (err) => {
            if (err) return res.status(500).send('Internal Server Error');
            return res.status(200).send('OK');
        })
    })


}

const delete_post = (req, res) => {
    let post_id = parseInt(req.params.post_id);
    
    posts.getSinglePost(post_id, (err, post) => {
        if (err === 404) return res.sendStatus(404);
        if (err) return res.sendStatus(500);
    
        const loggedInUserId = req.user_id; 
        const author_id = post.author.user_id; 
    
        console.log("User ID:", loggedInUserId, "attempted to delete post ID:", post_id, "owned by user ID:", author_id);
    
        if (loggedInUserId !== author_id) {
            
            return res.status(403).send("Unauthorized: You cannot delete this post.");
        }
    
        
        posts.deletePost(post_id, (err) => {
            if (err) return res.status(500).send('Internal Server Error');
            return res.status(200).send('OK');
        });
    });
};

const add_like = (req, res) => {
    let post_id = parseInt(req.params.post_id);

    posts.getSinglePost(post_id, (err, post) => {
        const user_id = req.user_id;

        
        if (err === 404) return res.sendStatus(404);
        if (err) return res.sendStatus(500);

        posts.alreadyLiked(post_id, user_id, (err, hasLiked) => {
            if (err) return res.sendStatus(500);
            if (hasLiked) {
                return res.status(403).send("User has already liked this post.");
            }
            posts.addLike(post_id, user_id, (err) => {
                if (err) return res.status(500).send('Internal Server Error');
            return res.status(200).send('OK');
            });
        });
    });
};

const remove_like = (req, res) => {
    let post_id = parseInt(req.params.post_id);
    const { user_id } = req.body;

    posts.getSinglePost(post_id, (err, post) => {
        const user_id = req.user_id;

        
        if (err === 404) return res.sendStatus(404);
        if (err) return res.sendStatus(500);

        posts.alreadyLiked(post_id, user_id, (err, hasLiked) => {
            if (err) return res.sendStatus(500);

            if (!hasLiked) {
                return res.status(403).send("User hasn't liked this post. Cannot remove like.");
            }

            posts.removeLike(post_id, user_id, (err) => {
                if (err) return res.status(500).send('Internal Server Error');
                return res.status(200).send('OK');
            });
        });
    });

};

module.exports = {
    add_post: add_post,
    get_post: get_post,
    update_post: update_post,
    delete_post: delete_post,
    add_like: add_like,
    remove_like: remove_like,
};