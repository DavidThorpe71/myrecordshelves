const mongoose = require('mongoose');
const Record = mongoose.model('Record');

exports.homePage = (req, res) => {
	res.render('index', { title: 'My Record Shelves'} );
};

exports.addRecord = (req, res) => {
	res.render('editRecord', { title: 'Add Record' });
};

exports.createRecord = async (req, res) => {
	const record = new Record(req.body);
	await record.save();
	res.redirect('/');
}