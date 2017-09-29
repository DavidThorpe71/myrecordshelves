const mongoose = require('mongoose');
const Record = mongoose.model('Record');

exports.homePage = (req, res) => {
	res.render('index', { title: 'My Record Shelves'} );
};

exports.addRecord = (req, res) => {
	res.render('editRecord', { title: 'Add Record' });
};

exports.createRecord = async (req, res) => {
	const record = await (new Record(req.body)).save();
	req.flash('success', `Successfully created ${record.title} record`);
	res.redirect(`/records/${record.slug}`);
}

exports.getRecords = async (req, res) => {
	// query database for list of all records
	const records = await Record.find();
	console.log(records);
	res.render('records', { title: 'Records', records });
}