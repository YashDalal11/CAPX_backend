
const bookRideModel = require('../models/bookRide-model')
class BookRideService{
    async createBookRideDetails(data){
        const rideDetails = await bookRideModel.create(data)
        return rideDetails;
    }
    async findBookRideDetails(filter){
        return await bookRideModel.findOne(filter)
    }
}

module.exports = new BookRideService();