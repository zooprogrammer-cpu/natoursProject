// Schema for our data. Describing and validating it-
const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true
  },
  rating: {
    type: Number,
    default: 4.5
  },
  price: {
    type : Number,
    required: [true, 'A tour must have a price']
  }
});

//Model -
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;