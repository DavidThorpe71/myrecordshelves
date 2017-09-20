exports.homePage = (req, res) => {
	res.render('index', { title: 'My Record Shelves'} );
};

exports.addRecord = (req, res) => {
	res.render('editRecord', { title: 'Add Record' });
};