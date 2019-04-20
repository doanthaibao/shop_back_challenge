let Core = require('./Core');
const DB_PATH = './../database/Users.json';
const HttpStatus = require('http-status-codes');

class UserDAO extends Core {
    constructor() {
        super(DB_PATH);
        this.findUser = this.findUser.bind(this);
    }
    addUser(oUser) {
        try {
            var users = super.read();
            if (!users || !Array.isArray(users)) {
                users = [oUser];
            } else if (this.findUser(users, oUser).length > 0) {
                return {
                    success: false,
                    code: HttpStatus.BAD_REQUEST,
                    message: 'User is exist.'
                };
            } else {
                users.push(oUser);
            }
            super.update(users);
            return {
                success: true,
                code: HttpStatus.ACCEPTED,
                message: 'Create user sucessfuly.'
            };
        } catch (e) {
            return {
                success: false,
                code: HttpStatus.INTERNAL_SERVER_ERROR,
                message: e.toString()
            };
        }
    }
    findUser(users, oUser) {
        return users.filter(u => u.email === oUser.email);
    }
    getUser(oUser) {
        try {
            var users = super.read();
            let user = this.findUser(users, oUser);
            if (user.length > 0) {
                return {
                    success: true,
                    user: user[0]
                };
            } else {
                return {
                    success: false,
                    code: HttpStatus.UNAUTHORIZED,
                    message: 'User is not exist.'
                };
            }
        } catch (e) {
            return {
                success: false,
                code: HttpStatus.INTERNAL_SERVER_ERROR,
                message: e.toString()
            };
        }
    }
    update(oUser) {
        try {
            var users = super.read();
            let index = users.findIndex(u => u.email === oUser.email);
            if (index >= 0) {
                users[index] = oUser;
                super.update(users);
                return {
                    success: true
                };
            } else {
                return {
                    success: false,
                    code: HttpStatus.UNAUTHORIZED,
                    message: 'User is not exist.'
                };
            }

        } catch (e) {
            return {
                success: false,
                code: HttpStatus.INTERNAL_SERVER_ERROR,
                message: e.toString()
            };
        }
    }
    searchUser(oUser, size, page) {
        try {
            let users = super.read();
            var results = users.filter(u => {
                var c1 = false,
                    c2 = false,
                    c3 = false;
                if (oUser.email) {
                    c1 = u.email === oUser.email;
                }
                if (oUser.name) {
                    c2 = u.name === oUser.name;
                }
                if (oUser.latest) {
                    c3 = u.latest === oUser.latest;
                }
                return c1 || c2 || c3;
            });
            //Paging 
            let start = size * (page - 1);
            let end = start + size;
            results = results.slice(start, end);

            results = results.map(u => {
                delete u.password;
                delete u.role;
                return u;
            });
            return {
                success: true,
                data: results
            };
        } catch (e) {
            return {
                success: false,
                code: HttpStatus.INTERNAL_SERVER_ERROR,
                message: e.toString()
            };
        }
    }
}

module.exports = new UserDAO();