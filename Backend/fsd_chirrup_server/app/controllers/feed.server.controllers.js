const feed = require("../models/feed.server.models.js");

const get_feed = (req, res) => {
    const loggedInUserId = req.user_id; 

    feed.getFeed(loggedInUserId, (err, feed) => {
        if (err) {
            console.error('Error getting feed:', err);
            return res.sendStatus(500);
        } else {
            console.log('Feed retrieved successfully');
            return res.status(200).json(feed);
        }
    });
};


const get_public_feed = (req, res) => {
    feed.getPublicFeed((err, feed) => {
        if (err) {
            console.error('Error getting public feed:', err);
            return res.sendStatus(500);
        } else {
            console.log('Public feed retrieved successfully');
            return res.status(200).json(feed);
        }
    });
};

module.exports = {
    get_feed: get_feed,
    get_public_feed: get_public_feed
};




