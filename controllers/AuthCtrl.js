const express = require('express');
const router = express.Router();
const oAuthHandler = require('../handlers/AuthHandler'); 

router.post('/signup', oAuthHandler.signup);
router.post('/signin', oAuthHandler.signin);
router.post('/logout', oAuthHandler.logout);

module.exports = router;