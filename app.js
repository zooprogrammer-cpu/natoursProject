const fs = require ('fs');
const express = require('express');
const morgan = require('morgan');

const app = express();

// 1) Middlewares
app.use(morgan('dev')); // third party middleware
// middleware to put body data in the request
// it sits between the request and the response
// able to use express.json middleware to parse data
// from client and puts it into req.body object to
//send to endpoint that expects JSON data
app.use(express.json());
// We use app.use to use middleware.
// calling express.json() returns a function that gets added
// to the middleware stack.

// Creating our own middleware function
app.use((req, res, next) => {
  console.log('Hello from the middleware');
  next();
})

// another middleware to manipulate the request object -
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
})


const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`) );

//2) Route handlers
const getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status : 'success',
    requestedAt : req.requestTime,
    results : tours.length,
    data : {
      tours: tours
    }
  });
}

const getTour = (req,res) => {
  console.log(req.params);
  const id = req.params.id * 1; // trick to convert string to number
  const tour = tours.find(el=> el.id === id)

  // if the id is bigger than the  length of the tours array, show 400 error
  // if (id > tours.length) {
  if (!tour) {
    return res.status(404).json({
      status : 'fail',
      message: 'Invalid Id'
    })
  }

  res.status(200).json({
    status : 'success',
    // results : tours.length,
    data : {
      tour
    }
  });
}

const createTour = (req, res) => {
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
}

const updateTour = (req,res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status : 'fail',
      message: 'Invalid Id'
    })
  }

  res.status(200).json({
    status : 'success',
    data : {
      tour : '<Updated tour here..>'
    }
  })
}

const deleteTour = (req,res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status : 'fail',
      message: 'Invalid Id'
    })
  }

  res.status(204).json({
    status : 'success',
    data : null
  })
}

// 3. Routes

// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id/:x?', getTour);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

app.route('/api/v1/tours')
    .get(getAllTours)
    .post(createTour);

app.route('/api/v1/tours/:id')
    .get(getTour)
    .patch(updateTour)
    .delete(deleteTour);

// 4) Start server
const port = 3000;
// add a callback function that gets called as
// soon as the server starts listening
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});





