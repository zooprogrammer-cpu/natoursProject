const fs = require('fs');

tours = JSON.parse(
    fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

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

exports.createTour = (req, res) => {
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

exports.updateTour = (req,res) => {
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

exports.deleteTour = (req,res) => {
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
