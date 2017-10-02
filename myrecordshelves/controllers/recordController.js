const mongoose = require('mongoose');
const Record = mongoose.model('Record');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');

const multerOptions = {
	storage: multer.memoryStorage(),
	fileFilter(req, file, next) {
		const isPhoto = file.mimetype.startsWith('image/');
		if(isPhoto) {
			next(null, true);
		} else {
			next({ message: 'That filetype isn\'t allowed!' }, false);
		}
	}
};


exports.homePage = (req, res) => {
	res.render('index', { title: 'My Record Shelves'} );
};

exports.addRecord = (req, res) => {
	res.render('editRecord', { title: 'Add Record' });
};

exports.upload = multer(multerOptions).single('cover');

exports.resize = async (req, res, next) => {
	// check if there is no new file to resize
	if(!req.file) {
		next(); //skip to next middleware
		return;
	}
	const extension = req.file.mimetype.split('/')[1];
	req.body.cover = `${uuid.v4()}.${extension}`;
	// now we resize
	const cover = await jimp.read(req.file.buffer);
	await cover.resize(800, jimp.AUTO);
	await cover.write(`./public/uploads/${req.body.cover}`);
	// once we have written photo to our filesystem, keep going!!!
	next();
};

exports.createRecord = async (req, res) => {
	const record = await (new Record(req.body)).save();
	req.flash('success', `Successfully created ${record.title} record`);
	res.redirect(`/records/${record.slug}`);
};

exports.getRecords = async (req, res) => {
	// query database for list of all records
	const records = await Record.find();
	res.render('records', { title: 'Records', records });
};

exports.editRecord = async (req, res) => {
	//1. find record given the id
	const record = await Record.findOne({ _id: req.params.id });
	//2. confirm the user is the owner of the store
	//TODO
	//3. render out the edit form so user can update record
	res.render('editRecord', { title: `Edit ${record.title}`, record });
};

exports.updateRecord = async (req, res) => {
	//1. find and update the store
	const record = await Record.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true, // return the new store instead of the old one
		runValidators: true
	}).exec();
	//2. redirect to record and tell them it worked
	req.flash('success', `Successfully updated <strong>${record.title}</strong>. <a href="/records/${record.slug}">View Record</a>`);
	res.redirect(`/records/${record._id}/edit`);
};

exports.getRecordBySlug = async (req, res, next) => {
	const record = await Record.findOne({ slug: req.params.slug });
	if(!record) return next();
	res.render('record', { record, title: record.title })
};

exports.getRecordsByShelf = async (req, res) => {
	const shelf = req.params.shelf;
	const shelfQuery = shelf || { $exists: true };
	const shelvesPromise = Record.getShelfList();
	const recordsPromise = Record.find({ shelf: shelfQuery });
	const [shelves, records] = await Promise.all([shelvesPromise, recordsPromise]);

	res.render('shelves', { shelves, title: 'Shelves', shelf, records });
};