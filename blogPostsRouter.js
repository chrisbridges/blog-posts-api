const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {BlogPosts} = require('./models');

BlogPosts.create('Fun Blog Post Title', 'Such fun content', 'Spongebob');
BlogPosts.create('Even more Fun Blog Post Title', 'content content content', 'Chris');
BlogPosts.create('Title title', 'glitch cat', 'Jillian');

router.get('/', (req, res) => {
  res.json(BlogPosts.get());
  console.log('success');
});

router.post('/', jsonParser, (req, res) => {
  
});

router.delete('/:id', (req, res) => {
  BlogPosts.delete(req.params.id);
  console.log(`Deleted Blog Post ${req.params.id}`);
  res.status(204).end();
});


module.exports = router;