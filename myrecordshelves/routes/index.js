const express = require('express');
const router = express.Router();
const recordController = require('../controllers/recordController');
const { catchErrors } =require('../handlers/errorHandlers');

/* GET home page. */
router.get('/', recordController.homePage);
router.get('/add', recordController.addRecord);
router.post('/add', catchErrors(recordController.createRecord));

module.exports = router;
