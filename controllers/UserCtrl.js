const express = require('express');
const router = express.Router();
const oUserHandler = require('../handlers/UserHandler'); 

router.get('/search', oUserHandler.searchUser);
router.get('/test', oUserHandler.test);

module.exports = router;