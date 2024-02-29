const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

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


//3) ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// 4) Start server
const port = 3000;
// add a callback function that gets called as
// soon as the server starts listening
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});





