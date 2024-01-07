var express = require('express');
var router = express.Router();
const User = require('../models/user-model');
const Plant = require('../models/plant-model');

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

//Verify user - Login
router.post('/login', async(req, res, next) => {
    try {
        const {email, password} = req.body;

        if (email === '' || password === '') {
            res.status(401).json({message: 'Email and password required.'});
            return;
        }

        //Check that the email is in a valid format 
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        if (!emailRegex.test(email)) {
            res.status(400).json({message: 'Valid email address required.'});
            return;
        }

        let foundUser = await User.findOne({email}).populate('favorites');

        if (!foundUser) {
            res.status(401).json({message: `Could not find user with email: ${email}`});
            return;
        }

        //Use bcrypt to check if the password recieved from client matches the password in database
        const isPasswordCorrect = bcrypt.compareSync(password, foundUser.password);
        
        if (isPasswordCorrect) {
            const {_id, name, email, favorites} = foundUser;
            const userInfo = {_id, name, email, favorites};
            res.status(200).json({message: 'Login successful. ', userInfo})
        } else  {
            res.status(401).json({message: 'Password incorrect.'})
        }

    } catch (error) {
        console.error('Something went wrong while verifying user: ', error)
    }
});

module.exports = router;