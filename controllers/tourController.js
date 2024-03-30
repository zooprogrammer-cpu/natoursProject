const fs = require('fs');
const path = require('path'); // Import the path module to handle file paths

tours = JSON.parse(
    fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.checkID = (req, res, next, val) => {
  console.log(`Tour id is: ${val}`);

  if (req.params.id * 1 > tours.length) {
    // return is needed here otherwise it hits next and moves to next middleware
    return res.status(404).json({
      status : 'fail',
      message: 'Invalid Id'
    })
  }
  next(); // this makes it move to the next middleware
};

exports.checkBody = (req, res, next) => {
  console.log('Executing checkBody');
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Name or price are missing'
    })
  }
  next(); // if everything is correct, move to the next middleware

}


//2) Route handlers
exports.getAllTours = (req, res) => {
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

exports.getTour = (req,res) => {
  console.log(req.params);
  const id = req.params.id * 1; // trick to convert string to number
  const tour = tours.find(el=> el.id === id)
  console.log('in getTour, tour is:', tour);

  res.status(200).json({
    status : 'success',
    // results : tours.length,
    data : {
      tour
    }
  });
}

exports.createTour = (req, res) => {
  console.log('createTour', req.body);
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({id : newId}, req.body);
  tours.push(newTour);
  console.log('tours after push', tours);
  // to persist it into the file
  // we are inside of a callback function
  // that is running in an event loop
  // we never want to block the event loop
  // so we are not using the synchronous one
  // const tourController = require('./../controllers/tourController');
  // Construct the correct file path using path.join()
  const filePath = path.join(__dirname, '../dev-data/data/tours-simple.json');
  fs.writeFile(
      filePath,
      JSON.stringify(tours),
      err => {
        if (err) {
          // If there is an error writing to the file, send a 500 Internal Server Error response
          return res.status(500).json({
            status: 'error',
            message: 'Error writing to file',
            error: err.message // Include the error message in the response for debugging
          });
        }
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

exports.updateTour = (req,res) => {
  res.status(200).json({
    status : 'success',
    data : {
      tour : '<Updated tour here..>'
    }
  })
}

exports.deleteTour = (req,res) => {
  res.status(204).json({
    status : 'success',
    data : null
  })
}
