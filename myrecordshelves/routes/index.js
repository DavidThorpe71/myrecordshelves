const express = require('express');
const router = express.Router();
const recordController = require('../controllers/recordController')

/* GET home page. */
router.get('/', recordController.homePage);

module.exports = router;
