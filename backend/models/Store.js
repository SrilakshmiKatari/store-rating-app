// backend/models/Store.js
const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  location: String,
});

const Store = mongoose.model('Store', storeSchema);

module.exports = Store;
