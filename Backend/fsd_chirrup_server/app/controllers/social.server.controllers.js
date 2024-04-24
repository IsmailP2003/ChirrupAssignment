const social = require('../models/social.server.models');

const get_user = function(req, res) {
    const userId = parseInt(req.params.user_id);
    
    social.getSingleUser(userId, (err, userData) => {
        console.log("userData:", userData);

        if (err) {
            if (err === 404) {
                return res.status(404).send('User not found');
            } else {
                return res.status(500).send('Internal Server Error');
            }
        }

        
        return res.status(200).json(userData);
    });
}

const follow_user = function(req, res) {
    const userId = parseInt(req.params.user_id);
    const followerId = req.user_id;

    
    social.checkIfFollowing(userId, followerId, (err, isFollowing) => {
        if (err === 404) return res.sendStatus(404);
        if (err) return res.sendStatus(500);

        if (isFollowing) {
            return res.status(403).send('User is already being followed');
        }

       
        social.followUser(userId, followerId, (err, result) => {
            if (err) return res.status(500).send('Internal Server Error');
            return res.status(200).send('OK');
        });
    });
}

const unfollow_user = function(req, res) {
    const userId = parseInt(req.params.user_id);
    const followerId = req.user_id;

    social.checkIfFollowing(userId, followerId, (err, isFollowing) => {
        if (err === 404) return res.sendStatus(404);
        if (err) return res.sendStatus(500);

        if (!isFollowing) {
            return res.status(403).send('User is not being followed');
        }

       
        social.unfollowUser(userId, followerId, (err, result) => {
            if (err) return res.status(500).send('Internal Server Error');
            return res.status(200).send('OK');
        });
    });

}

const search_users = (req, res) => {
    const searchTerm = req.query.q;
    console.log("searchTerm:", searchTerm);

    if (!searchTerm) {
        
        social.getAllUsers((err, users) => {
            if (err) {
                console.error('Error fetching all users:', err);
                return res.sendStatus(500);
            }

            if (!users || users.length === 0) {
                return res.status(404).send([]); 
            }

            return res.status(200).send(users);
        });
    } else {
        
        social.searchUsers(searchTerm, (err, users) => {
            if (err) {
                console.error('Error searching for users:', err);
                return res.sendStatus(500);
            }

            if (!users || users.length === 0) {
                return res.status(200).send([]); 
            }

            return res.status(200).send(users);
        });
    }
};

module.exports = {
    get_user: get_user,
    follow_user: follow_user,
    unfollow_user: unfollow_user,
    search_users: search_users
}