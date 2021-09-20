const mongoose = require('mongoose');

const rSchema = mongoose.Schema({
    id: Number,
    reminder: String,
    date: String,
    memberId: String,
});

const model = mongoose.model('Reminders', rSchema);

module.exports = model;