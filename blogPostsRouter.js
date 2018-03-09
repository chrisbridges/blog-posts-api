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
  const requiredFields = ['title', 'content', 'author'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing "${field}" in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }

  const item = BlogPosts.create(req.body.title, req.body.content, req.body.author);
  res.status(201).json(item);
});

router.delete('/:id', (req, res) => {
  BlogPosts.delete(req.params.id);
  console.log(`Deleted Blog Post ${req.params.id}`);
  res.status(204).end();
});


module.exports = router;