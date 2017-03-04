const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// const OptionSchema = new Schema({
// 	options: String,
// 	count: Number
// });

const NewPollSchema = new Schema({
	author: String,
	title: String,
	date: String,
	polls: []
});

const Poll = mongoose.model('poll', NewPollSchema);

module.exports = Poll;
