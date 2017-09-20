const express = require('express');
const router = express.Router();
const recordController = require('../controllers/recordController')

/* GET home page. */
router.get('/', recordController.homePage);
router.get('/add', recordController.addRecord);

module.exports = router;
