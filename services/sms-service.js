class SMSService{
    async sendSMS(text,phone){
        const accountSID = process.env.TWILIO_ACCOUNT_SID
        const authToken = process.env.TWILIO_AUTH_TOKEN
        const client = require('twilio')(accountSID, authToken);
        try{
            await client.messages.create({
                from:process.env.TWILIO_PHONE_NUMBER,
                to:`+91${phone}`,
                body:`${text}`
            }).then(message=>console.log(`Message send by this meassage id ${message.sid}`))
        }
        catch(err){
            console.log(err)
        }
        
    }

}

module.exports = new SMSService();