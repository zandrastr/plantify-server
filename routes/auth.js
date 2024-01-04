var express = require('express');
var router = express.Router();
const User = require('../models/user-model');

//Related to npm-package bcrypt that will handle encryption of passwords
const bcrypt = require('bcrypt');
const saltRounds = 10;

//Create user - Signup
router.post('/signup', async(req, res, next) => {
    try {
    const {email, password, name} = req.body;

    if (email === '' || password === '' || name === '') {
        res.status(400).json({message: 'Email, password and name required.'});
        return;
    }

    //Check that the email is in a valid format 
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email)) {
        res.status(400).json({message: 'Valid email address required.'});
        return;
    }

    let foundUser = await User.findOne({email});

    if (foundUser) {
        res.status(400).json({message: `User with email: ${email} already exists.`});
        return;
    }

    const salt = bcrypt.genSaltSync(saltRounds);
    const encryptedPassword = bcrypt.hashSync(password, salt);

    await User.create({email, password: encryptedPassword, name}); 
    
    res.status(201).json({name, email});
        
    } catch (error) {
        console.error('Something went wrong while creating user: ', error)
    }
});

module.exports = router;