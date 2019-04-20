let oUUID = require('./UUID');
const bcrypt = require('bcrypt');
const HttpStatus = require('http-status-codes');
const oDataConverter = require('./DataConverter');
const saltRounds = 10;


class Utils {
    generateOTP(email, time, role) {
        let input = JSON.stringify({
            email: email,
            exp: time, 
            role: role
        });
        return oUUID.encrypt(input);
    }

    decodeOTP(text) {
        var result = "";
        try {
            result = JSON.parse(oUUID.decrypt(text));
        } catch (e) {}
        return result;
    }

    isValidField(field) {
        return field && field.length > 0;
    }

    hashPassword(password) {
        return bcrypt.hashSync(password, saltRounds);
    }

    comparePassword(password, hash) {
        return bcrypt.compareSync(password, hash);
    }

    handleResponse(res, oResult, device, field) {
        let code = oResult.code;
        delete oResult.code;
        if(field && Array.isArray(oResult.data)){
            oResult.data = oDataConverter.convertData(oResult.data, field,device);
        }
        return res.status(code ? code : HttpStatus.OK).json(oResult);
    }
}

module.exports = new Utils();