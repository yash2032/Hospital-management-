const express = require('express');
const router = express.Router();
//const auth = require("../auth");
const _ = require('lodash');
var isValidDate = require('is-valid-date');
var {Patient} = require('./../server/models/patient.js');
var {rooms, Room} = require('./../server/models/rooms.js');


// GET /app/addpatient -> go to addPatient page

router.get('/app/addpatient', (req, res) => {
    res.json({message:"Add patient page"});
});


router.get('/app/addpatient', (req, res) => {
    res.render('addpatient', {pageTitle: "Add patient"});
});


router.post('/app/addpatient', (req, res) => {

    // receive the symptoms from the form in the array PD, each element being a String with the symptom name
    
    var dateOfBirth = req.body.dateOfBirth;

    // Check for empty fields
    if (_.isEmpty(req.body.name)   || !isValidDate(dateOfBirth) ) {
        if (_.isEmpty(req.body.name)) res.json({ message:'Please enter the  name.'});
        if (!isValidDate(dateOfBirth)) res.json({ message:'Please enter the  DOB.'});
        res.status(400).redirect('/app/addpatient');
    } else {
      
        var sex = req.body.sex;
        if (sex === "male") {
            sex = true;
        } else {
            sex = false;
        }
        

       
        var patient = Patient({
            name: _.capitalize(req.body.name),
            email: req.body.email,
            sex: sex,
            dateOfBirth: dateOfBirth,
            bloodGroup: req.body.bloodGroup,
            symptoms: req.body.symptoms,
            room: req.body.room
        });
        
        patient.save().then((patient) => {
            patient.updateScore();
            res.status(200).json({message:"Added the patient"});
        }).catch((err) => {
            console.log(err);
            res.status(400).json({message:"Error adding the patient" });
        });
   }
});


router.get('/app/getpatients', (req, res) => {
    Patient.find({}).then((patients) => {
        
        patients_with_room ={};

        res.status(200).send(patients);
    }).catch((err) => {
        console.log(err);
        res.status(400).send();
    });
});

router.post('/app/movePatientToRoom', async (req, res) => {
    const patient = await Patient.findById(req.body.id);

    patient.room=req.body.room;
    patient.save();

    const availRoom = await Room.findOne({name : req.body.room})
    availRoom.availability=false;
    availRoom.save();

    res.status(200).send(patient);
    
});

router.post('/app/movePatientToWaitingRoom', async (req, res) => {
    const patient = await Patient.findById(req.body.id);
   
    patient.room="noroom";
    patient.save();

    const availRoom = await Room.findOne({name : req.body.room})
    availRoom.availability=true;
    availRoom.save();

    res.status(200).send(patient);
    
});

router.get('/app/getpatients_withroom', (req, res) => {
    Patient.find({room:{$ne : "noroom"}}).then((patients) => {
        res.status(200).send(patients);
    }).catch((err) => {
        console.log(err);
        res.status(400).send();
    });
});

router.get('/app/getpatients_withoutroom', (req, res) => {
    Patient.find({room:{$eq : "noroom"}}).then((patients) => {
        res.status(200).send(patients);
    }).catch((err) => {
        console.log(err);
        res.status(400).send();
    });
});


router.get('/app/patient/:patientNumber',async (req, res) => {
    _id = req.params.patientNumber;
    Patient.findOne({
        _id
    }).then((patient) => {
        if (_.isEmpty(patient)) {
            throw Error('Patient does not exist');
        }
        res.status(200).send(patient);
    }).catch((err) => {
        console.log(err);
        res.status(404).json({message:"Error"});
    });
});

router.post('/app/deletepatient/:patientNumber',async (req, res) => {
    var _id = req.params.patientNumber;

    await Promise.all([Room.find({}), Patient.findOne({_id})])
        .then((data) => {
            var rooms = data[0];
            var patient = data[1];

            
            if (patient.room !== 'noroom') {
                 for (var i = 0; i < rooms.length; ++i) {
                    if (rooms[i].name === patient.room) {
                         rooms[i].availability = true;
                         rooms[i].save();
                         break;
                    }
                 }
            }

            patient.remove().then((patients) => {
               res.status(200).json({message:"Deletion successfull"});
            });
         }).catch((err) => {
            res.status(400).json({message:"Deletion unsuccessfull"});
         });
});



module.exports = router;