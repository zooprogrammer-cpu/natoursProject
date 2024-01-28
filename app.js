const express = require('express');
const app = express();

// Routing - how does an app respond to a certain client request
app.get('/', (req, res) => {
  //send just sends it to client
  // res.status(200).send('Hello from the server side');
  // can also use json
  res.status(200)
      .json(
          { message : 'Hello from the server side',
            app : 'Natours'
          });

});

app.post('/', (req, res) => {
  res.send('You can post to this endpoint...');
});

const port = 3000;
// add a callback function that gets called as
// soon as the server starts listening
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});



