const crypto = require('crypto')
class HashService{
    async generateHash(data){
        return await crypto.createHash('sha256').update(data).digest('hex');
    }
}

module.exports = new HashService();