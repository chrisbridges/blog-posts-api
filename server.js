'use strict';

const express = require('express');
const app = express();

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const {PORT, DATABASE_URL} = require('./config');
const {BlogPost} = require('./models');

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

app.get('/posts/:id', (req, res) => {
  BlogPost
  .findById(req.params.id)
  .then(restaurant => res.json(restaurant.serialize()))
  .catch(err => {
    console.error(err);
    res.status(404).json({message: 'Content Not Found'});
  });
});

app.post('/posts', (req, res) => {
  const post = {title: 'Cool title', content: 'Lorem ipsum', author: 'Me'};
  BlogPost.create(post, (err, doc) => {
    if (err) {
      return res.status(400).json({message: 'Bad Request'});
    }
    res.status(201).json(doc.serialize());
  });

res.status(200).json({message: "It works!"});
//check MongoDB log

});

app.use('*', function (req, res) {
  res.status(404).json({message: 'Not found'});
});


let server;

function runServer(databaseURL, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseURL, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer};