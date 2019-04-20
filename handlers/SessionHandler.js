const oUtils = require('../utils/Utils');
const HttpStatus = require('http-status-codes');
const oUserDAO = require('../daos/UserDAO');
const oACLHandler = require('./ACLHandler');
const EXPIRE_TIME = 2 * 60 * 60 * 1000;

class SessionHander {
    constructor() {
        this.inMemoryStore = new Map();
        this.handle = this.handle.bind(this);
        this.addNewSession = this.addNewSession.bind(this);
        this.updatelatestAccess = this.updatelatestAccess.bind(this);
    }
    addNewSession(email, device) {
        this.inMemoryStore.set(`${email}:${device}`, 1);
    }
    removeSession(email, device) {
        this.inMemoryStore.delete(`${email}:${device}`);
    }

    updatelatestAccess(oOTP, res, latest) {
        var user = oUserDAO.getUser({ email: oOTP.email }).user;
        user.latest = latest;
        oUserDAO.update(user);
        let otp = oUtils.generateOTP(user.email, user.latest + EXPIRE_TIME, user.role);
        this.addNewSession(oOTP.email, oOTP.device);
        res.set('uuid', otp); 
    }

    handle(req, res, next) {
        let otpToken = req.headers['uuid'];
        let device = req.headers['x-device'];
        var oResult = {
            success: false,
            code: HttpStatus.UNAUTHORIZED
        };
        if (!otpToken) {
            if(oACLHandler.isAnonymousAllowed(req.method, req.originalUrl)){ 
                req.session = {role: 'anonymous'};
                return next();
            }
            oResult.message = 'Missing OTP (uuid).';
        } else {
            let oOTP = oUtils.decodeOTP(otpToken);
            let obj = this.inMemoryStore.get(`${oOTP.email}:${device}`);
            if (obj) {
                let exp = oOTP.exp;
                if (Date.now() - exp >= 0) {
                    this.inMemoryStore.removeSession(oOTP.email, device);
                    oResult.message = 'OTP is expired.';
                } else {
                    this.updatelatestAccess(oOTP, res, Date.now());
                    req.session = {role: oOTP.role};
                    return next();
                }
            } else {
                oResult.message = 'OTP is invalid.';
            }
        }
        return oUtils.handleResponse(res, oResult);
    }
}
module.exports = new SessionHander();