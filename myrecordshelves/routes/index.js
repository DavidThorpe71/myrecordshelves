const express = require('express');
const router = express.Router();
const recordController = require('../controllers/recordController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const { catchErrors } =require('../handlers/errorHandlers');

/* GET home page. */
router.get('/', catchErrors(recordController.homePage));
router.get('/records', catchErrors(recordController.getRecords));
router.get('/records/page/:page', catchErrors(recordController.getRecords));
router.get('/add', 
	authController.isLoggedIn,
	recordController.addRecord
);

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

router.get('/records/:slug', catchErrors(recordController.getRecordBySlug));

router.get('/shelves', catchErrors(recordController.getRecordsByShelf));
router.get('/shelves/:shelf', catchErrors(recordController.getRecordsByShelf));

//Admin routes below here
router.get('/login', userController.loginForm);
router.post('/login', authController.login);
//TODO work out where to position the register page to stop unknown people registering
router.get('/register', userController.registerForm);

// 1. Validate Registration data
// 2. Register the user
// 3. We need to log them in
router.post('/register', 
	userController.validateRegister,
	userController.register,
	authController.login
);

router.get('/logout', authController.logout);

router.get('/account', 
	authController.isLoggedIn,
	userController.account
);
router.post('/account', catchErrors(userController.updateAccount));
router.post('/account/forgot', catchErrors(authController.forgot));
router.get('/account/reset/:token', catchErrors(authController.reset));
router.post('/account/reset/:token',
	authController.confirmedPasswords,
	catchErrors(authController.update)
);

/*
APIs
*/

router.get('/api/search', catchErrors(recordController.searchRecords));

module.exports = router;
