const CONFIG_PATH = '../config/acl.json';
const fs = require('fs');
const path = require('path');
const HttpStatus = require('http-status-codes');
const oUtils = require('../utils/Utils');

const ROLES = {
    'ANNONYMOUS': 'anonymous',
    'ADMIN': 'admin',
    'USER': 'user'
};
const ACTION = {
    'ALLOW': 'allow',
    'DENY': 'deny'
};

class ACLHanlder {
    constructor() {
        this._fileName = CONFIG_PATH;
        this.readConfig = this.readConfig.bind(this);
        this.onInitPermission = this.onInitPermission.bind(this);
        this.isAnonymousAllowed = this.isAnonymousAllowed.bind(this);
        this.isAllowed = this.isAllowed.bind(this);
        this.doDeny = this.doDeny.bind(this);
        this.authorize = this.authorize.bind(this);
        this.isMatchURL = this.isMatchURL.bind(this);
        this.isMatchMethod = this.isMatchMethod.bind(this);
        this.permissions = new Map();
        this.onInitPermission();
    }

    onInitPermission() {
        var that = this;
        let aPermissions = this.readConfig();
        aPermissions.forEach(perm => {
            that.permissions[perm.role] = perm.permissions;
        });
    }

    readConfig() {
        var result = fs.readFileSync(path.join(__dirname, this._fileName));
        return JSON.parse(result);
    }

    doDeny() {
        return {
            status: 'Access denied',
            code: HttpStatus.UNAUTHORIZED,
            success: false,
            message: 'Unauthorized access'
        };
    }

    isAllowed(method, accessUrl, permissions) {
        if (permissions && permissions.length > 0) {
            for (let i = 0; i < permissions.length; i++) {
                if (this.isMatchURL(accessUrl, permissions[i].access_url) 
                    && permissions[i].action == ACTION.ALLOW 
                    && this.isMatchMethod(method, permissions[i].method)) {
                    return true;
                }
            }
        }
        return false;
    }

    isMatchURL(requestUrl, definedURL) {
        if (requestUrl.startsWith(definedURL) ||
            definedURL === "*") {
            return true;
        }
        return false;
    }

    isMatchMethod(requestMethod, definedMethod) {
        if ((Array.isArray(definedMethod) 
            && definedMethod.includes(requestMethod.toUpperCase())) 
            || definedMethod === "*") {
            return true;
        }
        return false;
    }

    isAnonymousAllowed(method, accessUrl) {
        let permissions = this.permissions[ROLES.ANNONYMOUS];
        return this.isAllowed(method, accessUrl, permissions);
    }

    authorize(req, res, next) {
        if (req.session && req.session.role) {
            let role = req.session.role;
            let pers = this.permissions[role];
            if (this.isAllowed(req.method, req.originalUrl, pers)) {
                return next();
            }
        }
        return oUtils.handleResponse(res, this.doDeny());
    }

}
module.exports = new ACLHanlder();