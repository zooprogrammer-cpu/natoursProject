const fs = require('fs');
const path = require('path'); // Import the path module to handle file paths
const Tour =require('./../models/tourModel');
// const tours = JSON.parse(
//     fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

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

exports.createTour = async (req, res) => {
  try {
    // const newTour = new Tour({})
    // newTour.save();
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status : 'success',
      data : {
        tour : newTour
      }
    })
  }
  catch(err) {
    res.status(400).json({
      status: 'fail',
      message : 'Invalid data sent!'
    })

  }
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
