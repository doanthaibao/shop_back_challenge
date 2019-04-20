var express = require('express');
var router = express.Router();
const oSessionHandler = require('../handlers/SessionHandler');
const oACLHandler = require('../handlers/ACLHandler');

router.use('/api/user',
    oSessionHandler.handle,
    oACLHandler.authorize,
    require('./UserCtrl'));

router.use('/api/',
    oSessionHandler.handle,
    oACLHandler.authorize,
    require('./AuthCtrl'));

module.exports = router;