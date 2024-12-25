const mongoose = require('mongoose');

// Define the Item Schema
const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  dateCreated: { type: Date, default: Date.now },
});

// Define the Project Schema (you can expand this as needed)
const ProjectSchema = new mongoose.Schema({
  projectName: { type: String, required: true },
  description: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
});

// Create the models from the schemas
const Item = mongoose.model('Item', ItemSchema);
const Project = mongoose.model('Project', ProjectSchema);

// Export the models for use in other files
module.exports = { Item, Project };