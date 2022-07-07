const express = require('express');
const _ = require('lodash');
const router = express.Router();
const auth = require("../auth");
var {Patient} = require('./../server/models/patient.js');
var {rooms, Room} = require('./../server/models/rooms.js');


/*
    POST /app/addroom -> add a new room in the system
*/



router.post('/app/addroom',(req, res) => {
    var roomName = req.body.roomName;
    
    if (_.isString(roomName) && !_.isNaN(roomName)) {
        var room = Room({
            name: roomName,
        });

        room.save().then((room) => {
            console.log('Room added');
            res.status(200).json({message:"Room added successfully"});
        }).catch((err) => {
            console.log(err);
            res.status(400).json({message:"Error"});
        });
    } else {
        res.status(400).json({message:"Error"});
    }
});

/*
    GET /app/getrooms -> return JSON with all rooms status in the system
*/
router.get('/app/getrooms', (req, res) => {
    Room.find({}, null, {sort: {name: 1}}).then((rooms) => {
        var roomsJSON = {};
        
        for (var i = 0; i < rooms.length; ++i) {
            roomsJSON[rooms[i].name] = rooms[i].availability;
        }
     
        //res.setHeader('Content-Type', 'application/json');
        res.status(200).send(JSON.stringify(roomsJSON));
    }).catch((err) => {
        console.log(err);
        //res.setHeader('Content-Type', 'application/json');
        res.status(400).send(JSON.stringify({noroom: false}));
    });
});

router.get('/app/getAvailableRooms', (req, res) => {
    Room.find({availability:{$eq : true}}, null, {sort: {name: 1}}).then((rooms) => {
    
        //res.setHeader('Content-Type', 'application/json');
        res.status(200).send(rooms);
    }).catch((err) => {
        console.log(err);
        //res.setHeader('Content-Type', 'application/json');
        res.status(400).send(JSON.stringify({noroom: false}));
    });
});




module.exports = router;