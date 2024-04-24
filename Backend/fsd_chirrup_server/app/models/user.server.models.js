const db = require('../../database');
const crypto = require('crypto');

const addNewUser = (user, done) => {
    const salt = crypto.randomBytes(64);
    const hash = getHash(user.password, salt);

    const sql =
        'INSERT INTO users (first_name, last_name, username, password, salt) VALUES (?,?,?,?,?)';
    let values = [
        user.first_name,
        user.last_name,
        user.username,
        hash,
        salt.toString('hex'),
    ];

    db.run(sql, values, function(err) {
        if (err) {
            return done(err);
        }
        
        return done(null, this.lastID); 
    });
};

const getHash = (password, salt) => {
    return crypto.pbkdf2Sync(password, salt, 100000, 256, 'sha256').toString('hex');
};

const authenticateUser = (username, password, done) => {
    const sql = 'SELECT user_id, username, password, salt FROM users WHERE username = ?';
    console.log(username);
    db.get(sql, [username], (err, row) => {
        if (err) {
            
            return done(err);
        }
        
        if (!row) {
            console.log('User not found:', username);
            
            return done(400);
        }
        if (row.salt === null) {
            row.salt = '';
        }

        let salt = Buffer.from(row.salt, 'hex');

        if (row.password === getHash(password, salt)) {
            
            return done(false, row.user_id);
        } else {
            console.log('Incorrect password for user:', username);
            
            return done(400);
        }
    });
};

const getToken = (token,done) => {
    const sql = 'SELECT session_token FROM users WHERE user_id=?';
    db.get(sql,[token],(err,row) => {
        if(err) return done(err);
        if(!row) return done(404);
        return done(null,row.session_token);
    })
}

const setToken = (id, done) => {
    let token = crypto.randomBytes(16).toString('hex');
    const sql = 'UPDATE users SET session_token=? WHERE user_id=?';
    db.run(sql, [token, id],(err) => {
        return done(err, token);
    });
}

const removeToken = (id, done) => {
    const sql = 'UPDATE users SET session_token=NULL WHERE session_token=?';
    db.run(sql, [id], (err) => {
        return done(err);
    });
}

const getIdFromToken = (token, done) => {
    const sql = 'SELECT user_id FROM users WHERE session_token=?';
    const params = [token];
    db.get(sql, params, (err, row) => {
        if (err) { 
            return done(err, null);
        } 
        if (!row) { 
            return done(new Error('Token not found or invalid'), null);
        }
        
        const userId = row.user_id;
        done(null, userId); 
    });

}


module.exports = {
    addNewUser: addNewUser,
    authenticateUser: authenticateUser,
    getToken: getToken,
    setToken: setToken,
    removeToken: removeToken,
    getIdFromToken: getIdFromToken
}