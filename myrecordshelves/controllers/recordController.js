const mongoose = require('mongoose');
const Record = mongoose.model('Record');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');
const axios = require('axios');

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


exports.homePage = async (req, res) => {
	// query database for list of all records for search to work
	// const records = await Record
	// 	.find()
	// 	// .skip(skip)
	// 	// .limit(limit)
	const shelf = req.params.shelf;
	const shelfQuery = shelf || { $exists: true };
	const shelvesPromise = Record.getShelfList();
	const recordsPromise = Record.find({ shelf: shelfQuery });
	const [shelves, records] = await Promise.all([shelvesPromise, recordsPromise]);
	res.render('index', { title: 'My Record Shelves', records, shelves, shelf });
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
	req.body.author = req.user._id;
	const record = await (new Record(req.body)).save();
	req.flash('success', `Successfully created ${record.title} record`);
	res.redirect(`/records/${record.slug}`);
};

exports.getRecords = async (req, res) => {
	const page = req.params.page || 1;
	const limit = 9;
	const skip = (page * limit) - limit;
	// query database for list of all records
	const recordsPromise = Record
		.find()
		.skip(skip)
		.limit(limit)
		.sort({ created: 'desc' });

	const countPromise = Record.count();

	const [records, count] = await Promise.all([recordsPromise, countPromise]);

	const pages = Math.ceil(count / limit);
	if (!records.length && skip) {
		req.flash('info', `Hey you asked for page ${page}. But that doesn't exist. So I put you on page ${pages}`)
		res.redirect(`/records/page/${pages}`);
		return;
	}

	res.render('records', { title: 'Records', records, page, pages, count });
};

const confirmOwner = (record, user) => {
	if (!record.author.equals(user._id)) {
		throw Error('You must own a record in order to edit it');
	}
}

exports.editRecord = async (req, res) => {
	//1. find record given the id
	const record = await Record.findOne({ _id: req.params.id });
	//2. confirm the user is the owner of the store
	confirmOwner(record, req.user);
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
	/*
API
*/

	const url = `https://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=${process.env.API_KEY}&artist=${record.artist}&album=${record.title}&format=json`

	axios
		.get(url)
		.then(res => {
			const album = res.data.album;
			// if(!album.length) {
			// 	console.log('no record found');
			// 	return;
			// }
			const tracks = album.tracks.track
			for(const track of tracks) {
				console.log(track.name);
			};
		})
		.catch(console.error);

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

exports.searchRecords = async (req, res) => {
	const records = await Record
	// First find records that match
	.find({
		$text: {
			$search: req.query.q
		}
	},{
		score: { $meta: 'textScore' }
	})
	// Then sort them
	.sort({
		score: { $meta: 'textScore' }
	})
	// limit search results to 5
	.limit(5);
	res.json(records);
};


