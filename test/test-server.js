const chai = require('chai');
const chaiHttp = require('chai-http');
const {app, runServer, closeServer} = require('../server');
const expect = chai.expect;
chai.use(chaiHttp);

describe('Blog Posts', function () {

  before(function () {
    return runServer();
  });

  after(function () {
    return closeServer();
  });

  it('should list items on GET', function () {
    return chai.request(app)
    .get('/blog-posts')
    .then(function(res) {
      expect(res).to.have.status(200);
      expect(res).to.be.json;
      expect(res.body).to.be.a('array');
      expect(res.body.length).to.be.at.least(1);

      const expectedKeys = ['title', 'content', 'author', 'publishDate'];
      res.body.forEach(function(item) {
        expect(item).to.be.a('object');
        expect(item).to.include.keys(expectedKeys);
      });
    });
  });

  it('should add items on POST', function () {
    const newPost = {title: 'This is my title', content: 'foo bar foo', author: 'Me'};
    return chai.request(app)
    .post('/blog-posts')
    .send(newPost)
    .then(function(res) {
      expect(res).to.have.status(201);
      expect(res).to.be.json;
      expect(res.body).to.be.a('object');
      expect(res.body).to.include.keys('title', 'content', 'author', 'id', 'publishDate');
      expect(res.body.id).to.not.equal(null);
      expect(res.body).to.deep.equal(Object.assign(newPost, {id: res.body.id, publishDate: res.body.publishDate}));
    });
  });

  it('should update items on PUT', function() {
    const updatePost = {title: 'foo', content: 'foo foo', author: 'Chris'};
    return chai.request(app)
      .get('/blog-posts')
      .then(function(res) {
        updatePost.id = res.body[0].id;
        return chai.request(app)
          .put(`/blog-posts/${updatePost.id}`)
          .send(updatePost);
      })
      .then(function(res) {
        expect(res).to.have.status(204);
      });
  });

  it('should delete items on DELETE', function() {
    return chai.request(app)
      .get('/recipes')
      .then(function(res) {
        return chai.request(app)
          .delete(`/recipes/${res.body[0].id}`);
      })
      .then(function(res) {
        expect(res).to.have.status(204);
      });
  });

});