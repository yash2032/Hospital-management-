const mongoose = require ('mongoose');


var RoomSchema = mongoose.Schema({
	name: {
        type: String,
        unique: true,
	   required: true,
    },
    availability: {
        type: Boolean,
        required: true,
        default: true
    }
});

var Room = mongoose.model('Room', RoomSchema);

var rooms = {};


module.exports = {rooms, Room};