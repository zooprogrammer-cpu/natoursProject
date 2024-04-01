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

router
    .route('/')
    .get(tourController.getAllTours)
    .post(tourController.checkBody, tourController.createTour);

router
    .route('/:id')
    .get(tourController.getTour)
    .patch(tourController.updateTour)
    .delete(tourController.deleteTour);

module.exports = router;