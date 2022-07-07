const mongoose = require("mongoose");
const validator = require("validator");
const { all } = require("../../routes/patient.js");
const {scoreOfDisease, Disease} = require('./diseases.js');
///const autoIncrement = require('mongoose-sequence')(mongoose);

var PatientSchema = mongoose.Schema({
    // _id : Number,
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
            throw new Error("Email is Invalid");
            }
        },
    },
    dateOfBirth: {
        type: String,
        required: true,
    },
    sex: {
        // true = male
        // false = female
        type: Boolean,
        required: true,
        default: true
    },
    bloodGroup: {
        type: String,
        required: true,
    },
    symptoms: {
        type: Array,
        required: true,
    },
    diseases: {
        type: Array,
        default: []
     },
    score: {
        type: Number,
        default: 0
    },
    room: {
        type: String,
        default: 'noroom'
    },});
    
// },{ _id: false });

//PatientSchema.plugin(autoIncrement);

PatientSchema.methods.updateScore = async function () {

	let patient = this;
    let symptoms = patient.symptoms;
    let alldiseases = await Disease.find();
    let score = 0;
    let possibleDiseases = [];

    alldiseases.forEach( (disease) => {

        let countMatch = 0;
        let numberOfSymptoms = disease.symptoms.length;

        for(let i = 0 ; i < symptoms.length ; i++ ){
            var sym = symptoms[i];
            
            if(disease.symptoms.includes(sym)){
                countMatch++;
            }

        }
 
        let percentageMatch = (countMatch*100)/(numberOfSymptoms);

        if(percentageMatch >= 70){
            possibleDiseases.push(disease.name);
            score += disease.score;
            
        }

        
    })

    patient.diseases = possibleDiseases;
    patient.score = score;

    patient.save();
	
	
	};


var Patient = mongoose.model('Patient', PatientSchema);
module.exports = {Patient};