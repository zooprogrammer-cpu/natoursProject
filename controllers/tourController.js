const fs = require('fs');
const path = require('path'); // Import the path module to handle file paths
const Tour =require('./../models/tourModel');
// const tours = JSON.parse(
//     fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

//2) Route handlers
exports.getAllTours = async (req, res) => {
  try {
    console.log(req.query);

    // BUILD QUERY
    // 1A) Filtering
    const queryObj = {...req.query}; // make a copy of the query
    const excludedFields = ['page', 'sort', 'limit', 'fields']

    // Remove these fields from the queryObj
    excludedFields.forEach(el=>{
      delete queryObj[el]
    })

    // 1B) Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    let query = Tour.find(JSON.parse(queryStr));

    // 2) SORTING
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt'); // default query sort
    }

    // 3) Field Limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    }
    else {
      query = query.select('-__v');
    }

    // EXECUTE QUERY
    const tours = await query;


    // SEND QUERY
    res.status(200).json({
      status : 'success',
      results : tours.length,
      data : {
        tours: tours
      }
    });

  }
  catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    })
  }
}

exports.getTour = async (req,res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    //findById is a method from mongoose that is  the shorthand for
    //await Tour.findOne({_id: req.params.id})

    res.status(200).json({
      status : 'success',
      data : {
        tour
      }
    });
  }
  catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    })
  }
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
      message : err
    })

  }
}

exports.updateTour = async (req,res) => {
  try {
    // query for the document and update it
    // new:true, the new updated document is the one that will be returned
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      status : 'success',
      data : {
        tour
      }
    })
  }
  catch (err) {
    res.status(400).json({
      status: 'fail',
      message : err
    })
  }
}

exports.deleteTour = async (req,res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id)
    res.status(204).json({
      status : 'success',
      data : null
    })
  }
  catch (err) {
    res.status(404).json({
      status: 'fail',
      message : err
    })
  }

}
