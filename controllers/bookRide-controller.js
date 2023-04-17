const rideService = require('../services/ride-service')
const bookRideService = require('../services/bookRide-service')
const smsService = require("../services/sms-service")
const userService = require('../services/user-service')
class BookRide{
    async bookRide(req,res){
        // console.log(req.body);
        const{rideGiverUserId,rideGiverRideId,rideTakerUserId,rideTakerRideId} = req.body
        if(!rideGiverUserId || !rideGiverRideId || !rideTakerUserId || !rideTakerRideId){
            return res.status(400).json({
                message:"All fields are Required"
            })
        }

        // 1. save ride giver and ride taker details
        // 2. delete ride take and ride giver ride from ride table
        // 3. add ride details to book table
        // 4. send sms to ride giver and ride taker

        // 1. save ride giver and ride taker details
        let rideTaker
        let rideGiver
        try{
            rideTaker = await rideService.findRide({_id:rideTakerRideId})
            rideGiver = await rideService.findRide({_id:rideGiverRideId})
        }
        catch(err){
            console.log(err)
            return res.status(500).json({
                message:"Database error"
            })
        }

        // 2. delete ride take and ride giver ride from ride table
        let rideTakerRideDelete
        let rideGiverRideDelete
        try{
            rideTakerRideDelete = await rideService.deleteRide({_id:rideTakerRideId})
            rideGiverRideDelete = await rideService.deleteRide({_id:rideGiverRideId})
        }
        catch(err){
            console.log(err)
            return res.status(500).json({
                message:"Database error"
            })
        }

        // 3. add ride details to book table
        if(rideTakerRideDelete && rideGiverRideDelete){
            
            try{
                const rideDetails = await bookRideService.createBookRideDetails({
                    rideGiverUserId,
                    rideTakerUserId,
                    startingPoint:rideTaker[0].startingPoint,
                    destinationPoint:rideTaker[0].destinationPoint,
                    rideGiverGender:rideGiver[0].gender,
                    rideTakerGender:rideTaker[0].gender
    
                })
                // 4. send sms to ride giver and ride taker
                let rideGiverDetails;
                let rideTakerDetails
                try{
                    rideGiverDetails = await userService.findUser({_id:rideGiverUserId})
                    rideTakerDetails = await userService.findUser({_id:rideTakerUserId})
                    const textForRideGiver =  `your ride is book with ${rideTakerDetails.name}`
                    const textForRideTaker =  `your ride is book with ${rideGiverDetails.name}`

                    // sms to ride Giver
                    // smsService.sendSMS(textForRideGiver,rideGiverDetails.phone)
                    // sms to ride Giver
                    // smsService.sendSMS(textForRideTaker,rideTakerDetails.phone)
                }
                catch(err){
                    console.log(err)
                    return res.status(400).json({
                        message:"Ride Book nut notification not send"
                    })
                }
                return res.json({
                    rideTaker:rideTakerDetails,
                    rideGiver:rideGiverDetails
                })
            }
            catch(err){
                console.log(err)
                return res.status(500).json({
                    message:"Ride Not Book"
                })
            }
            
        }
    }
}

module.exports = new BookRide();