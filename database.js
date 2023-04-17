const mongoose = require('mongoose')

function dbConnect(){
    const url = process.env.DATABASE_URL
    try{
        mongoose.connect(url)
        .then(console.log("Database Connected..."))
    }
    catch(err){
        console.log(err)
        res.status(500).json({message:"Error from Database"})
    }
}

module.exports = dbConnect;