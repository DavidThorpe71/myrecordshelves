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
	},
	author: {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
		required: 'You must supply an author'
	}
});

// This section sets the slug
recordSchema.pre('save', async function(next) {
	if (!this.isModified('title')) {
		next(); //skip it
		return; // stops this function from running
	}
	this.slug = slug(this.title);
	// find other records that have a slug of title, title-1, title-2 etc
	const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
	const recordsWithSlug = await this.constructor.find({ slug: slugRegEx });
	if(recordsWithSlug.length) {
		this.slug = `${this.slug}-${recordsWithSlug.length + 1}`;
	}
	next();
});

recordSchema.statics.getShelfList = function() {
	return this.aggregate([
		{ $group: { _id: '$shelf', count: { $sum: 1 } }},
		{ $sort: { count: 1 }}
	]);
}

module.exports = mongoose.model('Record', recordSchema);