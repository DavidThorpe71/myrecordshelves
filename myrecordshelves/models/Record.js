const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slugs');

const recordSchema = new mongoose.Schema({
	artist: {
		type: String,
		trim: true,
		required: 'Please enter the artist\'s name!'
	},
	title: {
		type: String,
		trim: true,
		required: 'Please enter the record\'s name!'
	},
	shelf: {
		type: Number,
		required: 'Please enter the current shelf the record is on!'
	},
	slug: String,
	format: {
		type: [],
		required: 'Please select a format!'
	},
	cover: String,
	created: {
		type: Date,
		default: Date.now
	}
});

// This section sets the slug
recordSchema.pre('save', function(next) {
	if (!this.isModified('title')) {
		next(); //skip it
		return; // stops this function from running
	}
	this.slug = slug(this.title);
	next();
	// TODO update this to make more resillient so slugs are unique for matching titles
});

module.exports = mongoose.model('Record', recordSchema);