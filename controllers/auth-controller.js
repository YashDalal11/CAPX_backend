const otpService = require('../services/otp-service')
const hashService = require('../services/hash-service')
const userModel = require('../models/user-model')
const tokenService = require('../services/token-service')
const userService = require('../services/user-service')
const UserDto = require('../dtos/user-dto')

class AuthController{
    // send otp
    async sendOtp(req,res){
        const {phone} = req.body
        if(!phone){
            //400 - error is from client side 
            res.status(400).json({message:"Enter Valid Number"})
            return;
        }
        // otp generate                             -done 
        // send otp to number                       -done
        // generate hash of otp+phone+expireTime    -done
        // res = hash,phone                         -done

        // 1. generate Otp
        const otp = await otpService.generateOtp();

        // 2. send otp to number - using twilio
        // otpService.sendOtpSMS(otp,phone)
        console.log(otp)

        // 3 generate Hash
        const otpValidDurtion = 1000*60*2;
        const otpExpireTime = Date.now()+otpValidDurtion;
        const data = `${phone}.${otp}.${otpExpireTime}`
        const hash = await hashService.generateHash(data);

        try{
            res.json({
                hash:`${hash}.${otpExpireTime}`,
                phone
            })
        }
        catch(err){
            console.log(err)
            // 500 - means error on sever side as failed in sending otp
            res.status(500).json({message:"OTP Sending Failed"})
        }

    }

    

    // verify otp
    async verifyOtp(req,res){
        const {phone,hash,otp} = req.body;
        // console.log(phone);
        if(!phone || !hash || !otp){
            res.status(400).json({message:"All fields are required"})
            return
        }
        
        // check expire time                                  -done
        // otp is valid or not                                -done
        // find user in database if not present then create   -done
        // create jwt token - accesstoken and refresh token   -done
        // save refreshToken in database                      -done
        // send accesstoken and refreshtoken as a cookie      -done


        const [hashedOtp,otpExpireTime] = hash.split('.');
        // 1.check expire time
        if(Date.now()>+otpExpireTime){
            res.status(400).json({message:"Otp Expired"})
            return
        }
        

        // 2.otp is valid or not
        const data = `${phone}.${otp}.${otpExpireTime}`
        const valid = await otpService.validateOtp(data,hashedOtp);
        if(!valid){
            res.status(400).json({message:"Invalid Otp"})
            return
        }


        // 3. find user in database if not present then create
        let user

        try{
            user = await userService.findUser({phone});
            if(!user){
                user = await userService.createUser({phone})
            }
        }catch(err){
            console.log(err)
            res.status(500).json({message:"Database Error"})
            return
        }


        // 4. create jwt token - accesstoken and refresh token
        const {accessToken,refreshToken} = await tokenService.generateTokens({
            _id:user._id,
            activated:false,
        })
        // console.log(`refreshToken:${refreshToken}`)


        // 5. save refreshToken in database
        await tokenService.saveRefreshTokens(refreshToken,user._id)


        // 6. send accesstoken and refreshtoken as a cookie
        await res.cookie('refreshToken',refreshToken,{
            maxage:1000*60*60*24*30,
            httpOnly:true
        })

        await res.cookie('accessToken',accessToken,{
            maxage:1000*60*60*24*30,
            httpOnly:true
        })

        // to customize the attributes of user data 
        const userDto = new UserDto(user);
        // console.log(userDto)
        res.json({
            user:userDto,
            auth:true
        })

    }
}
module.exports = new AuthController();