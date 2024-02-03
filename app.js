const fs = require ('fs');
const express = require('express');
const app = express();
// middleware to put body data in the request
// it sits between the request and the response
app.use(express.json());

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

// POst- send request from client to server.
// this is in the request
// out of the box, express does not put body data in the request
// we need to use a middleware, app.use(express.json)
app.post('/api/v1/tours', (req,res) => {
  // console.log(req.body);
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({id : newId}, req.body);
  tours.push(newTour);
  // to persist it into the file
  // we are inside of a callback function
  // that is running in an event loop
  // we never want to block the vent loop
  // so we are not using the synchronous one
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    err => {
      // 201 stands for created
      res.status(201).json({
        status : 'success',
        data : {
          tour : newTour
        }
      })
    }
  )
  // res.send('Done');
});

const port = 3000;
// add a callback function that gets called as
// soon as the server starts listening
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});



