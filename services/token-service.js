const jwt =  require('jsonwebtoken')
const refreshModel = require('../models/refersh-model')
const accessTokenSecret = process.env.ACCESSTOKEN_SECRET
const refreshTokenSecret = process.env.REFRESHTOKEN_SECRET
class TokenService{
    async generateTokens(data){
        
        const accessToken = await jwt.sign(data,accessTokenSecret,{
            expiresIn:'1h'
        })
        const refreshToken = await jwt.sign(data,refreshTokenSecret,{
            expiresIn:'1y'
        })
        return {accessToken,refreshToken}

    }
    async saveRefreshTokens(refreshToken,userId){
        try{
            await refreshModel.create({
                token:refreshToken,
                userId
            })
        }
        catch(err){
            console.log(`mongodb:${err.message}`);
        }
    }

    async verifyAccessToken(token){
        return jwt.verify(token,accessTokenSecret);
    }
}

module.exports = new TokenService();