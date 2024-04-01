const fs = require('fs');
const path = require('path'); // Import the path module to handle file paths
const Tour =require('./../models/tourModel');
// const tours = JSON.parse(
//     fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

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

  // res.status(200).json({
  //   status : 'success',
  //   requestedAt : req.requestTime,
  //   results : tours.length,
  //   data : {
  //     tours: tours
  //   }
  // });
}

exports.getTour = (req,res) => {
  console.log(req.params);
  const id = req.params.id * 1; // trick to convert string to number
  // const tour = tours.find(el=> el.id === id)
  // console.log('in getTour, tour is:', tour);

  // res.status(200).json({
  //   status : 'success',
  //   // results : tours.length,
  //   data : {
  //     tour
  //   }
  // });
}

exports.createTour = (req, res) => {
  res.status(201).json({
    status : 'success',
    // data : {
    //   tour : newTour
    // }
  })
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
