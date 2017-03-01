const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OptionSchema = new Schema({
	option: String,
	count: Number
});

const NewPollSchema = new Schema({
	author: String,
	title: String,
	polls: [BookSchema]
});

const Poll = mongoose.model('polls', NewPollSchema);

module.exports = Poll;
