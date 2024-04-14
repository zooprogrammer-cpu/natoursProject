const fs = require('fs');
const path = require('path'); // Import the path module to handle file paths
const Tour =require('./../models/tourModel');
// const tours = JSON.parse(
//     fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

//2) Route handlers
// middleware method for top 5 tours before it gets to the getAllTours below
exports.aliasTopTours = (req,res,next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next(); //need this otherwise this middleware will be stuck here for ever
}

class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // 1A) Filtering
    const queryObj = {...this.queryString}; // make a copy of the query
    const excludedFields = ['page', 'sort', 'limit', 'fields']

    // Remove these fields from the queryObj
    excludedFields.forEach(el=>{
      delete queryObj[el]
    })

    // 1B) Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  // 2) SORTING
  sort () {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    }
    else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate () {
    const page = this.queryString.page * 1 || 1 // convert string to number. Default value as 1.
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page -1) * limit; // skip 20 results if on page 3
    console.log(`page: ${page}, limit: ${limit}, skip: ${skip}`);
    // 127.0.0.1:3000/api/v1/tours/?page=2&limit=10
    // 1-10 for page 1, 11-20 for page 2, 21-30 for page 3
    // page 2 means skip 10
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

exports.getAllTours = async (req, res) => {
  try {
    console.log(req.query);

    // BUILD QUERY
    // 1A) Filtering
    // const queryObj = {...req.query}; // make a copy of the query
    // const excludedFields = ['page', 'sort', 'limit', 'fields']
    //
    // // Remove these fields from the queryObj
    // excludedFields.forEach(el=>{
    //   delete queryObj[el]
    // })

    // 1B) Advanced filtering
    // let queryStr = JSON.stringify(queryObj);
    // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    //
    // let query = Tour.find(JSON.parse(queryStr));

    // 2) SORTING
    // if (req.query.sort) {
    //   const sortBy = req.query.sort.split(',').join(' ');
    //   query = query.sort(sortBy);
    // }
    // else {
      //query = query.sort('-createdAt'); // default query sort
    // }

    // 3) Field Limiting
    // if (req.query.fields) {
    //   const fields = req.query.fields.split(',').join(' ');
    //   query = query.select(fields);
    // }
    // else {
    //   query = query.select('-__v');
    // }

    //4) Pagination
    // const page = req.query.page * 1 || 1 // convert string to number. Default value as 1.
    // const limit = req.query.limit * 1 || 100;
    // const skip = (page -1) * limit; // skip 20 results if on page 3
    // console.log(`page: ${page}, limit: ${limit}, skip: ${skip}`);
    // // 127.0.0.1:3000/api/v1/tours/?page=2&limit=10
    // // 1-10 for page 1, 11-20 for page 2, 21-30 for page 3
    // // page 2 means skip 10
    // query = query.skip(skip).limit(limit);
    //
    // if (req.query.page) {
    //   const numTours = await Tour.countDocuments();
    //   if (skip >= numTours) {
    //     throw new Error('This page does not exist');
    //   }
    // }

    // EXECUTE QUERY
    // make a new object of APIFeatures class abd pass the queries
    // chaining these methods work since we are returning something from each method
    // we keep on adding methods to the query ne after another
    const features = new APIFeatures(Tour.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    const tours = await features.query;

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
