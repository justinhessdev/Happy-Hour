// Post Model
const
  mongoose = require('mongoose'),
  postSchema = new mongoose.Schema({
    business_id: {type: String},
    business_name: {type: String},
    times: {type: String},
    description: {type: String},
    specials: {type: String},
    neighborhood: {type: String}
  }, {timestamps: true})

module.exports = mongoose.model('Post', postSchema)
