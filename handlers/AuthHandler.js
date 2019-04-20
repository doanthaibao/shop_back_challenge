const oUtils = require('../utils/Utils');
const oUserDAO = require('../daos/UserDAO');
const HttpStatus = require('http-status-codes');
let oSessionHandler = require('../handlers/SessionHandler');
class AuthHander {
    signup(req, res) {
        let device = req.headers['x-device'];
        let language = req.headers['x-language'];
        let name = req.body.name;
        let email = req.body.email;
        let password = req.body.password;
        var oResult = {};
        if (oUtils.isValidField(name) &&
            oUtils.isValidField(email) &&
            oUtils.isValidField(password)) {
            let oUser = {
                name: name,
                email: email,
                password: oUtils.hashPassword(password),
                createAt: Date.now(),
                latest: Date.now(),
                role: email.startsWith('admin') ? 'admin' : 'user' //Temporary solution to create an admin user
            }; 
            oResult = oUserDAO.addUser(oUser);
        } else {
            oResult = { success: false, message: 'Params are invalid.' };
        }
        oUtils.handleResponse(res, oResult);
    }
    signin(req, res) {
        let device = req.headers['x-device'];
        let language = req.headers['x-language'];
        let email = req.body.email;
        let password = req.body.password;
        var oResult = {};
        let oUser = {
            email: email
        };
        let dbUser = oUserDAO.getUser(oUser);
        if (dbUser.success) {
            if (oUtils.comparePassword(password, dbUser.user.password)) {
                dbUser.user.latest = Date.now();
                oSessionHandler.updatelatestAccess({ email: email, device: device }, res, dbUser.user.latest);
                oSessionHandler.addNewSession(oUser.email, device);
                oResult = {
                    success: true,
                    data: [{
                        email: dbUser.user.email,
                        name: dbUser.user.name,
                        latest: dbUser.user.latest,
                        createAt: dbUser.user.createAt
                    }]
                };

            } else {
                oResult = { success: false, code: HttpStatus.UNAUTHORIZED, message: 'Password was wrong.' };
            }
        } else {
            oResult = dbUser;
        }
        return oUtils.handleResponse(res, oResult, device, 'user');
    }
    logout(req, res) {
        let otpToken = req.headers['uuid'];
        let oOTP = oUtils.decodeOTP(otpToken);
        oSessionHandler.removeSession(oOTP.email, oOTP.device);
        oUtils.handleResponse(res, {
            success: true,
            message: 'User has been logout.'
        });
    }
}

module.exports = new AuthHander();