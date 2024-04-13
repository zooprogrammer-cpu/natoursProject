const express = require("express");
const tourController = require('./../controllers/tourController');
const router = express.Router();

// using the param - the console.log only prints if the
// url has an id such as get tour which has an id
// router.param('id', tourController.checkID);

// create a checkBody middleware function
// when creating a new tour,
// check if body contains the name and price property
// if not, send 400 status code
// Add it to the post handler stack

// popular URL to show 5 top tours-
// need middleware first to change the request object
// when someone hits /top-5-cheap,
// the first middleware function to run is aliasTopTours

router
    .route('/top-5-cheap')
    .get(tourController.aliasTopTours, tourController.getAllTours);

router
    .route('/')
    .get(tourController.getAllTours)
    .post(tourController.createTour);

router
    .route('/:id')
    .get(tourController.getTour)
    .patch(tourController.updateTour)
    .delete(tourController.deleteTour);

module.exports = router;