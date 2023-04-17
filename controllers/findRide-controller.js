const userService = require('../services/user-service')
const rideService = require('../services/ride-service')
const bookRideService = require('../services/bookRide-service')
class FindRide{
    async findMatch(req,res){
        // console.log(req.body)
        const {startingPoint,destinationPoint,gender,userCategory,_id,retry} = req.body
        if(!startingPoint || !destinationPoint || !gender || !userCategory || !_id || !retry){
            console.log("error1")
            return res.status(400).json({
                message:"All fields are Required"
            })
        }
        // 1. check user exist
        // 2. check already ride exist or not
        // 3. add ride into respective category
        // 4. find matching rides

        try{
            const bookRide1 = await bookRideService.findBookRideDetails({rideGiverUserId:_id})
            if(bookRide1){
                console.log(bookRide1.rideTakerUserId)
                const partner = await userService.findUser({_id:bookRide1.rideTakerUserId})
                return res.json({
                    bookRideId:bookRide1._id,
                    partner
                })
            }
            const bookRide2 = await bookRideService.findBookRideDetails({rideTakerUserId:_id})
            if(bookRide2){
                console.log(bookRide2.rideGiverUserId)
                const partner = await userService.findUser({_id:bookRide2.rideGiverUserId})
                return res.json({
                    bookRideId:bookRide2._id,
                    partner
                })
            }
            
        }catch(err){
            console.log("err")
            return res.status(500).json({
                message:"Database error"
            })
        }
        console.log("outer")

        // 1. check user exist
        try{
            const user = await userService.findUser({_id});
            // console.log("user")
            // console.log(user)
            if(!user){
                return res.status(400).json({
                    message:"User Doesn`t exist"
                })
            }
        }
        catch(err){
            console.log("err")
            return res.status(500).json({
                message:"Database error"
            })
        }

        // 2. check already ride exist or not
        let userRideId
        try{
            await rideService.findRide({
                userId:_id
            }).then(ride=>{
                console.log(ride)
                if(ride.length!=0){
                    userRideId=ride[0]._id
                    console.log("userRideId")
                    console.log(userRideId)
                    // console.log("Already Requested")
                    if(retry==="false"){
                        return res.status(400).json({
                            message: "You have already requested for a ride"
                        })
                    }
                    
                }
            })
            // console.log(ride)
            
            
        }
        catch(err){
            console.log(err)
            return res.status(500).json({
                message:"Database error"
            })
        } 
        
        
        // 3. add ride into respective category
        if(retry==="false"){
            try{
                const ride =  await rideService.createRide({
                    userId:_id,
                    startingPoint,
                    destinationPoint,
                    gender,
                    userCategory
                })
                // console.log("Ride Created");
                userRideId=ride._id;
            }
            catch(err){
                console.log(err)
                return res.status(500).json({
                    message:"Database error"
                })
            } 
        }
        

        // 4. find matching rides
        try{
            const category = userCategory==="Ride Taker"?"Ride Giver":"Ride Taker"
            const rides =  await rideService.
            findRide({
                startingPoint,
                destinationPoint,
                gender,
                userCategory:category,
            })
            const Rides = await rides.filter(ride=> ride.userId!=_id)
            // console.log(Rides)
            // console.log("Rides Returned")

            let finalRides=[]
            // await Rides.forEach(async(rideee)=>{
            //     console.log("ride1")
            //     console.log(rideee)
            //     const {userId}= rideee
            //     console.log(userId)
            //     const user = await userService.findUser({_id:userId})
            //     console.log("user")
            //     console.log(user)
            //     await finalRides.concat(user)
            //     console.log("finalrides")
            //     console.log(finalRides)
            // })
            for (let i = 0; i < Rides.length; i++) {
                // console.log(Rides[i]);
                const {userId} = Rides[i];
                const user = await userService.findUser({_id:userId})
                const u = {rideID:Rides[i]._id,user}
                // user[0].rideId={rideID:Rides[i]._id}
                // console.log(u)
                finalRides.push(u);
                // console.log('Ride_id')
                // console.log(Rides[i]._id)
                // finalRides[i]["rideId"]=Rides[i]._id
                // console.log("finalRide")
                // console.log(finalRides)
              }
            return res.json({
                userRideId,
                rides:finalRides
            })
        }
        catch(err){
            console.log(`find Match: ${err}`)
            return res.status(500).json({
                message:"Database error"
            })
        }
        
    }
}

module.exports = new FindRide();