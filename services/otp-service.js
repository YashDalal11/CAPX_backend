const crypto = require('crypto')
const hashService = require('./hash-service')
class OtpService{
    generateOtp(){
        return crypto.randomInt(1000,9999);
    }
    async sendOtpSMS(otp,phone){
        const accountSID = process.env.TWILIO_ACCOUNT_SID
        const authToken = process.env.TWILIO_AUTH_TOKEN
        const client = require('twilio')(accountSID, authToken);

        await client.messages.create({
            from:process.env.TWILIO_PHONE_NUMBER,
            to:`+91${phone}`,
            body:`Otp code for user verification is ${otp} 
            -From CAPX`
        }).then(message=>console.log(`Message send by this meassage id ${message.sid}`))
    }

    async validateOtp(data,hashedOtp){
        const hash = await hashService.generateHash(data);
        return hash===hashedOtp
    }
}

module.exports = new OtpService();