const express = require('express');

const app = express();

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/posts', (req, res) => {
  BlogPost
  .find()
  .then(restaurants => {
    res.json({
      restaurants: restaurants.map(restaurant => restaurant.serialize())
    });
  })
  .catch(err => {
    console.error(err);
    res.status(500).json({message: 'Internal Server Error'});
  });

});

app.use('*', function (req, res) {
  res.status(404).json({message: 'Not found'});
});


let server;

function runServer() {
  const port = process.env.PORT || 8080;
  return new Promise((resolve, reject) => {
    server = app.listen(port, () => {
      console.log(`Your app is listening on port ${port}`);
      resolve(server);
    }).on('error', err => {
      reject(err)
    });
  });
}

function closeServer() {
  return new Promise((resolve, reject) => {
    console.log('Closing server');
    server.close(err => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer};