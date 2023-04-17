const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Model = mongoose.model

const bookRideSchema = new Schema({
    rideGiverUserId:{
        type:String,
        required:true,
    },
    rideTakerUserId:{
        type:String,
        required:true,
    },
    startingPoint:{
        type:String,
        required:true,
    },
    destinationPoint:{
        type:String,
        required:true,
    },
    rideGiverGender:{
        type:String,
        required:true,
    },
    rideTakerGender:{
        type:String,
        required:true,
    }
},{
    timestamps:true,
})

const bookRide = Model('BookRide',bookRideSchema)

module.exports = bookRide