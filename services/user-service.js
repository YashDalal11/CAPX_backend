const userModel = require('../models/user-model')

class UserService{
    async findUser(filter){
        const user = await userModel.findOne(filter)
        return user;
    }
    async createUser(data){
        const user = await userModel.create(data)
        return user
    }
    async updateUser(filter,update){
        console.log("update user")
        const user = await userModel.updateOne(filter,update)
        console.log(user)
        return user
    }
}

module.exports = new UserService();