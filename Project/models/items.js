const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Completed'], required: true },
    creationDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Item', itemSchema);
