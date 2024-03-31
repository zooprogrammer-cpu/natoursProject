// Everything that is not related to express,
// we are going to do it outside of the app.js file here
// Environment variables that are outside the scope of Express

const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({path: './config.env'});

const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD);

// pass the DB string to mongoose.connect()
// the optional parameters are
// just to avoid some deprecation warnings.
// con will be the resolved value
mongoose.connect(DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
}).then(()=> console.log('DB Connection Successful'));

// Schema for our data. Describing and validating it-
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

// create new document instance. Making new object out of a class using ES6.
const testTour = new Tour({
  name: 'The Mountain Climber',
  rating: 5.0,
  price: 1999
});

// Save to database -
testTour.save().then(doc=>{
  console.log(doc);
}).catch(error=>{
  console.log('ERROR:', error);
})

// console.log(process.env);
const app = require('./app');

// 4) Start server
const port = process.env.port || 3000;
// add a callback function that gets called as
// soon as the server starts listening
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

