// Post Model
const
  mongoose = require('mongoose'),
  postSchema = new mongoose.Schema({
    business_id: {type: String},
    business_name: {type: String},
    times: {type: String},
    description: {type: String},
    specials: {type: String},
    neighborhood: {type: String},
    _author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
  }, {timestamps: true})

  postSchema.pre('findOne', function() {
    this.populate('_author')
  })
  postSchema.pre('find', function() {
    this.populate('_author')
  })
// middleware that runs before it returns results back to you
// when we do pre frind one we do someting before it spites back results to you
// you have reference model without it popolutaed it autom

module.exports = mongoose.model('Post', postSchema)
