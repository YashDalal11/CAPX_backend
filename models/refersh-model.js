const mongoose = require('mongoose');
const Schema = mongoose.Schema
const Model = mongoose.model

const refreshSchema = new Schema({
    token:{
        type:String,
        required:true,
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:'User',
    }
},{
    timestamps:true,
})

const refreshModel = Model('token',refreshSchema)

module.exports = refreshModel