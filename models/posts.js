// Post Model
const
  mongoose = require('mongoose'),
  postSchema = new mongoose.Schema({
    id: {type: String},
    time: {type: String},
    body: {type: String},
    specials: {type: String}
  }, {timestamps: true})

module.exports = mongoose.model('Post', postSchema)
