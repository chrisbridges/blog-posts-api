const uuid = require('uuid');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const blogPostSchema = mongoose.schema({

});

const BlogPost = mongoose.model('BlogPost', blogPostSchema);

module.exports = {BlogPost};