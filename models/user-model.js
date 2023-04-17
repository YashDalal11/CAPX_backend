const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Model = mongoose.model

const userSchema = new Schema({
    phone:{
        type:String,
        required:true,
    },
    name:{
        type:String,
        required:false,
    },
    avatar:{
        type:String,
        required:false,
    },
    activated:{
        type:Boolean,
        required:false,
        default:false
    }
    },{
        timestamps:true,
    }
)

const user = Model('User',userSchema)

module.exports = user