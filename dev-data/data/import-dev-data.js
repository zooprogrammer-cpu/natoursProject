// Everything that is not related to express,
// we are going to do it outside of the app.js file here
// Environment variables that are outside the scope of Express
const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./../../models/tourModel')

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

// READ JSON FILE
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'));

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data successfully loaded!');
    process.exit();
  } catch (err) {
    console.log('or loading data', err);
  }
}
// DELETE ALL DATA FROM COLLECTION
  const deleteData = async () => {
    try {
      await Tour.deleteMany();
      console.log('Data successfully deleted!');
      process.exit(); // just like Ctrl + C after the records get deleted.
    } catch (err) {
      console.log(err);
    }
  }

  if (process.argv[2] === '--import') {
    importData();
  } else if (process.argv[2] === '--delete') {
    deleteData();
  }


