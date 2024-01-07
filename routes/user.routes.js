var express = require('express');
var router = express.Router();
const User = require('../models/user.model');
const { default: mongoose } = require('mongoose');

//Related to npm-package bcrypt that will handle encryption of passwords
const bcrypt = require('bcrypt');
const saltRounds = 10;

//Edit user
router.put('/users/edit', async(req, res, next) => {

    try {
        const {_id, email, password, name} = req.body;
 
        if (!mongoose.Types.ObjectId.isValid(_id)) {
            res.status(400).json({message: 'Id is not valid.'});
            return;
        }

        if (email === '' || name === '') {
            res.status(400).json({message: 'Email and name required.'});
            return;
        }

        //Check that the email is in a valid format 
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        if (!emailRegex.test(email)) {
            res.status(400).json({message: 'Valid email address required.'});
            return;
        }

        let foundUser = await User.findOne({email}); 
        const foundUserId = foundUser._id.toString();

        if (foundUser && foundUserId !== _id) {
            res.status(400).json({message: `User with email: ${email} already exist.`});
            return;
        }
        
        if (password) {
            const salt = bcrypt.genSaltSync(saltRounds);
            const encryptedPassword = bcrypt.hashSync(password, salt);
            
            const payload = {_id, email, password: encryptedPassword, name};
            
            const updatedUser = await User.findOneAndUpdate({_id}, payload, {
                new: true
            });

            const userInfo = {_id: updatedUser._id, email: updatedUser.email, name: updatedUser.name};

            res.status(200).json({message: 'User updated successfully.', userInfo});
            return;
        }

        const payload = {_id, email, name};

        const updatedUser = await User.findOneAndUpdate({_id}, payload, {
            new: true
        });

        const userInfo = {_id: updatedUser._id, email: updatedUser.email, name: updatedUser.name};

        res.status(200).json({message: 'User updated successfully.', userInfo});

    } catch (error) {
        console.log("Something went wrong while editing user:", error);    
    }
});

//Remove plant from user favorites
router.put('/users/favorites/remove', async(req, res, next) => {
    try {
        const {userId, plantId} = req.body;

        if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(plantId)) {
            res.status(400).json({message: 'Invalid user id or invalid plant id.'});
            return;
        }

        await User.findByIdAndUpdate(userId, { $pull: {favorites: plantId}}); 
        res.status(200).json({message: 'Plant removed successfully.'});

    } catch (error) {
        console.log("Something went wrong while removing plant:", error);    
    }
});

module.exports = router;
