const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({path: './config.env'});

const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD);

// pass the DB string to mongoose.connect
// the optional parameters are
// just to avoid some deprecation warnings.
// con will be the resolved value
mongoose.connect(DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
}).then(()=> console.log('DB Connection Successful'));

// Everything that is not related to express,
// we are going to do it outside of the app.js file
// Environment variables that are outside the scope of Express

// console.log(process.env);
const app = require('./app');

// 4) Start server
const port = process.env.port || 3000;
// add a callback function that gets called as
// soon as the server starts listening
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

