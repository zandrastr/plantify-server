var express = require('express');
var router = express.Router();
const User = require('../models/user-model');
const Plant = require('../models/plant-model');

//Add a plant to database and/or user favorites
router.post('/plants/save', async(req, res, next) => {

    try {
        const {_id, name, latinName, description, sunNeeds, waterNeeds, imageUrl} = req.body;

        if (name === '' || latinName === '') {
            res.status(400).json({message: 'Name and Latin name required.'});
            return;
        }

        const foundUser = await User.findOne({_id});

        if (!foundUser) {
            res.status(400).json({message: 'Could not find user.'});
            return;
        }

        const foundPlant = await Plant.findOne({latinName});

        if (foundPlant) {
            await User.findByIdAndUpdate(_id, { $push: {favorites: foundPlant._id }}); 
            res.status(200).json({message: 'Plant saved successfully', foundPlant});
            return;
        }

        const createdPlant = await Plant.create({name, latinName, description, sunNeeds, waterNeeds, imageUrl});
        await User.findByIdAndUpdate(_id, { $push: {favorites: foundPlant._id }}); 
        res.status(200).json({message: 'Plant saved successfully', createdPlant});

    } catch (error) {
        console.log("Something went wrong while saving plant:", error);
    }
});

module.exports = router;