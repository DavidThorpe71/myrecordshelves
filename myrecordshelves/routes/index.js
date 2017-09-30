const express = require('express');
const router = express.Router();
const recordController = require('../controllers/recordController');
const { catchErrors } =require('../handlers/errorHandlers');

/* GET home page. */
router.get('/', catchErrors(recordController.getRecords));
router.get('/records', catchErrors(recordController.getRecords));
router.get('/add', recordController.addRecord);

router.post('/add', 
	recordController.upload,
	catchErrors(recordController.resize),
	catchErrors(recordController.createRecord)
);

router.post('/add/:id',
	recordController.upload,
	catchErrors(recordController.resize),
	catchErrors(recordController.updateRecord)
);

router.get('/records/:id/edit', catchErrors(recordController.editRecord));

module.exports = router;
