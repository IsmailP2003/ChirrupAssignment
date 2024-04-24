const users = require('../models/user.server.models.js');
const Joi = require('joi');

const add_user = (req, res) => {
    const schema = Joi.object({
        first_name: Joi.string().min(3).required(),
        last_name: Joi.string().min(3).required(),
        username: Joi.string().min(3).required(),
        password: Joi.string()
        .pattern(new RegExp(
            '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-])[a-zA-Z0-9!@#$%^&*()_+\\-]{8,25}$'
        )).required()
     });

    const { error } = schema.validate(req.body);
if (error) {
    console.error('Validation error:', error);
    return res.status(400).send({ error_message: error.details[0].message });
}

    let user = Object.assign({}, req.body);

    users.addNewUser(user, (err, id) => {
        if (err) {
            console.error('Error adding user:', err);
            return res.sendStatus(500);
        } else {
            console.log('User added successfully with ID:', id);
            return res.status(201).json({ user_id: id }); 
        }
    });
};

const login = (req, res) => {
    const schema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required()
    });

    const { error } = schema.validate(req.body);
    if (error) {
        console.error('Validation error:', error);
        return res.status(400).send({ error_message: error.details[0].message });

    }

    let username = req.body.username;
    let password = req.body.password;

    users.authenticateUser(username, password, (err,id) => {
        if (err === 400) return res.status(400).send({error_message:"Username or password is incorrect"}); 
        if(err) return res.status(500).send('Internal server error');

        users.getToken(id,(err,token) => {
            if(err) return res.status(500).send('Internal server error!');
            if(token) {
                return res.status(200).send({user_id: id,session_token:token});
            } else{
                users.setToken(id,(err,token) => {
                    if(err) return res.status(500).send('Internal server error!!');
                    return res.status(200).send({user_id: id,session_token:token});
                })
            }
        })
    });
}

const logout = (req, res) => {
    let token = req.header('X-Authorization');
    users.removeToken(token,(err) => {
        if(err) return res.status(500).send('Internal server error');
        return res.status(200).send('OK');
    })
}

module.exports = {
    add_user: add_user,
    login: login,
    logout: logout
}

