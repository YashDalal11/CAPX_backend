const ridesModel = require('../models/rides-model')

class RideService {
    async createRide(data){
        const ride = await ridesModel.create(data)
        return ride
    }
    async findRide(filter){
        const rides = await ridesModel.find(filter)
        return rides
    }
    async deleteRide(filter){
        const dlt = await ridesModel.deleteOne(filter)
        return dlt
    }
}

module.exports = new RideService();