const crypto = require('crypto');
const PASWORD = "shop_back_nodejs_challenge";
const ALGORITHM = 'aes192';

class UUID { 
    
    encrypt(text) {
        let cipher = crypto.createCipher(ALGORITHM, PASWORD);
        var crypted = cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
        return crypted;
    }
    decrypt(text) {
        let decipher = crypto.createDecipher(ALGORITHM, PASWORD);
        var decrypted = decipher.update(text, 'hex', 'utf8') + decipher.final('utf8');
        return decrypted;
    }
}
module.exports = new UUID();