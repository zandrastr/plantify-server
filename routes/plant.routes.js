var express = require('express');
var router = express.Router();
const User = require('../models/user.model');
const Plant = require('../models/plant.model');
const { default: mongoose } = require('mongoose');

// Get one plant from database
router.get('/plants/:latinName', async (req, res, next) => {
const { latinName } = req.params;

try {
    if (!latinName) {
    res.status(400).json({ message: 'Could not find plant.' });
    return;
    }

    let plant = await Plant.findOne({latinName})
    res.status(200).json(plant);

    } catch (error) {
        res.status(400).json({message: 'Something went wrong while getting one plant', error });
    }
});

//Add a plant to database and user favorites
router.post('/plants/save', async(req, res, next) => {

    try {
        const {_id, name, latinName, description, sunNeeds, waterNeeds, imageUrl} = req.body;

        if (name === '' || latinName === '') {
            res.status(400).json({message: 'Name and Latin name required.'});
            return;
        }

        if (!mongoose.Types.ObjectId.isValid(_id)) {
            res.status(400).json({message: 'User id is not valid.'});
            return;
        }

        const foundPlant = await Plant.findOne({latinName});

        if (foundPlant) {
            res.status(400).json({message: 'Plant already exists.'});
            return;
        }

        const foundUser = await User.findOne({_id});

        if (!foundUser) {
            res.status(400).json({message: 'Could not find user.'});
            return;
        }

        const createdPlant = await Plant.create({name, latinName, description, sunNeeds, waterNeeds, imageUrl});
        await User.findByIdAndUpdate(_id, { $push: {favorites: createdPlant._id }}); 
        res.status(200).json({message: 'Plant saved successfully', createdPlant});
        

    } catch (error) {
        console.log("Something went wrong while saving plant:", error);
    }
});

//Add a plant to database only (on share)
router.post('/plants/share/save', async(req, res, next) => {

    try {
        const {name, latinName, description, sunNeeds, waterNeeds, imageUrl} = req.body;

        if (name === '' || latinName === '') {
            res.status(400).json({message: 'Name and Latin name required.'});
            return;
        }

        const foundPlant = await Plant.findOne({latinName});

        if (foundPlant) {
            res.status(400).json({message: 'Plant already exists.', plant: foundPlant});
            return;
        }

        const createdPlant = await Plant.create({name, latinName, description, sunNeeds, waterNeeds, imageUrl});
        res.status(200).json({message: 'Plant saved successfully',  plant: createdPlant});

    } catch (error) {
        console.log("Something went wrong while saving plant:", error);
    }
});

module.exports = router;