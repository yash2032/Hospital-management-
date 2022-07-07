const express = require('express');
const router = express.Router();
const auth = require("../auth");
const _ = require('lodash');

var {scoreOfDisease, Disease} = require('./../server/models/diseases.js');
var {Patient} = require('./../server/models/patient.js');

router.get('/app/getdiseases', (req, res) => {
    Disease.find({}, null, {sort: {name: 1}}).then((diseases) => {
       
        var scoreOfDiseaseJSON = {};

        if (_.isArray(diseases)) {
            for (var i = 0; i < diseases.length; ++i) {
                scoreOfDiseaseJSON[diseases[i].name] = diseases[i].score;
            }
        }

       
        res.status(200).send(JSON.stringify(scoreOfDiseaseJSON));
    }).catch((err) => {
        console.log(err);
        res.status(404).send();
    });
});

router.post('/app/adddisease', (req, res) => {
    var diseaseName = req.body.name;
    var diseaseScore = req.body.score;
    var sym = req.body.symptoms;
    
    if (_.isString(diseaseName) && !_.isNaN(diseaseScore) && !_.isEmpty(sym)) {
        var disease = Disease({
            name: _.capitalize(diseaseName),
            score: diseaseScore,
            symptoms: sym
        });

        disease.save().then((disease) => {
            console.log('Disease added');
            res.status(200).json({message : "Disease added successfully"});
        }).catch((err) => {
            console.log(err);
            res.status(400).json("Error adding disease");
        });
    } else {
        res.status(400).json("Errror adding disease");
    }
});

router.post('/app/deletediseases', (req, res) => {
    var diseasesToDelete = req.body.DD;

    if (_.isArray(diseasesToDelete)) {
        for (var i = 0; i < diseasesToDelete.length; ++i) {
            
            var disease = diseasesToDelete[i];
            Disease.find({
                name: diseasesToDelete[i]
            }).remove().catch((err) => {
                console.log(err);
            });
          }
            res.status(200).json({message:"Deletion successfull"});
        } else {
                console.log("Deletion unsuccessfull");
                res.status(400).json({message:"Deletion unsuccessfull"});
            }
        });
        
    router.get('/app/getsymptoms', async (req, res) => {
            const diseases = await Disease.find({})
            
            
            var sym = new Set();
                
                diseases.forEach((disease)=>{
                    for(let i=0;i<disease.symptoms.length;i++){
                       
                       sym.add(disease.symptoms[i]);
                    }
                })
                

             var symp=[];

             sym.forEach((s)=>{
                symp.push(s);
             })
          
          res.status(200).send(symp);
            
        });
        

        
module.exports = router;