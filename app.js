const fs = require ('fs');
const express = require('express');
const app = express();

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`) );

// send to client using jsend data specification
app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status : 'success',
    results : tours.length,
    data : {
      tours: tours
    }
  });
});

const port = 3000;
// add a callback function that gets called as
// soon as the server starts listening
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});



