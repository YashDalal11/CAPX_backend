const Jimp = require('jimp')
const path = require('path')
// const Buffer = require('Buffer')
const userService = require('../services/user-service');
const UserDto = require('../dtos/user-dto');
class ActivateController{
    async activate(req,res){
        // Activation logic
        const {name,avatar} = req.body;
        if(!name || !avatar){
            res.status(400).json({message:"All fields are required"})
            return
        }

        //  base64 to Image
        const bufferImage = Buffer.from(avatar.replace(/^data:image\/png;base64,/,''),'base64')


        // compress to save the image
        const imagePath = `${Date.now()}-${Math.round(Math.random()*1e9)}.png`
        try{
            Jimp.read(bufferImage)
            .then((jimResp)=>{
                jimResp.resize(150,Jimp.AUTO).write(path.resolve(__dirname,`../storage/${imagePath}`))
            })
            
        }
        catch(err){
            console.log(err)
            res.status(500).json({message:'Could Not Process the Image'})
            return
        }

        // find the user
        const userId = req.user._id
        try{
            
            const filter = {_id: userId}
            const update = {$set:{
                activated:true,
                name: name,
                avatar: `/storage/${imagePath}`
            }}
            const result = await userService.updateUser(filter,update);
            const user = await userService.findUser({_id:userId})
            console.log(user)
            if(!user){
                res.status(404).json({message:"User Not Found"})
                return
            }
            
            res.json({user: new UserDto(user),auth:true})
        }catch(err){
            console.log(err)
            res.status(500).json({message:"Something Went Wrong"})
        }



        
    }
}

module.exports = new ActivateController()