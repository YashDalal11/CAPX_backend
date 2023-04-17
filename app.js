require('dotenv').config()
const express = require("express");
const router =require('./routes')
const dbConnect = require('./database')
const cors = require('cors')
const cookieParser = require('cookie-parser')

const app = express();

// middleware
app.use(express.json({limit:'8mb'}))
app.use('/storage',express.static('storage'))
const corsOption ={
    credentials:true,
    origin:['http://localhost:3000']
}
app.use(cors(corsOption))
app.use(cookieParser());

// database
dbConnect()

// ṛoutes
app.use(router)
app.get('/',async(req,res)=>{
    res.send("Welcome")
})

const PORT = process.env.PORT || 5500
app.listen(PORT,console.log(`Connect to Port ${PORT}`));