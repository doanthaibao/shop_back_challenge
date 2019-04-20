const oUserDAO = require('../daos/UserDAO');
const oUtils = require('../utils/Utils');
const MAX_SIZE = 100;
const DEFAULT_SIZE = 1;
class UserHandler {
    searchUser(req, res) {
        let device = req.headers['x-device'];
        let email = req.query.email;
        let name = req.query.name;
        let latest = req.query.latest;
        let size = !isNaN(req.query.size) ? parseInt(req.query.size) : MAX_SIZE;
        let page = !isNaN(req.query.page) ? parseInt(req.query.page) : DEFAULT_SIZE;
        let result = oUserDAO.searchUser({
            email: email,
            name: name,
            latest: latest
        }, size, page);
        oUtils.handleResponse(res, result, device, 'user');
    }
    test(req, res) {
        let device = req.headers['x-device']; 
        oUtils.handleResponse(res, {
            success: true,
            message: 'okay.'
        },device);
    }
}
module.exports = new UserHandler();