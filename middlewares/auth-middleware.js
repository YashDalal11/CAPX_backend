const tokenService = require("../services/token-service");

async function authMiddleware(req,res,next){
    try{
        const {accessToken} = req.cookies
        console.log(accessToken)
        if(!accessToken){
            throw new Error();
        }

        const userData = await tokenService.verifyAccessToken(accessToken)
        if(!userData){
            throw new Error();
        }
        req.user = userData
        next()
    }catch(err){
        res.status(401).json({message:"Invalid Token"})
    }
    
}

module.exports = authMiddleware