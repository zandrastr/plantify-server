const mongoose = require('mongoose');

const PlantSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
    },
    latinName: {
        type: String,
        required: [true, 'Latin name is required'],
    },
    description: String,
    sunNeeds: String,
    waterNeeds: String,
    imageUrl: String,
},
{
    timestamps: true
}
)

module.exports = mongoose.model('Plant', PlantSchema);
