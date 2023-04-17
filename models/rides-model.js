const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Model = mongoose.model

const ridesSchema = new Schema({
    userId:{
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
    gender:{
        type:String,
        required:true,
    },
    userCategory:{
        type:String,
        required:true,
    }
},{
    timestamps:true,
}
)

const ride = Model('Ride',ridesSchema)

module.exports = ride