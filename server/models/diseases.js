const mongoose = require ('mongoose');

var DiseaseSchema = mongoose.Schema({
    name: {
        type: String,
        unique: true,
	   required: true 
    },
    score: {
        type: Number,
        required: true,
        default: 0
    },
    symptoms: {
        type: Array,
        required: true,
        default: []
    },
});


var Disease = mongoose.model('Disease', DiseaseSchema);

var scoreOfDisease = {}; // empty map

module.exports = {scoreOfDisease, Disease};
