const
  express = require('express'),
  postRouter = express.Router(),
  Post = require('../models/Post.js')


  // .post((req, res) => {
  //   Post.create(req.body, (err, post) => {
  //     res.redirect('/posts/' + post._id)
  //   })
  // })
  postRouter.route('/')
  .get((req, res) => {
    var theFilter = {}
    console.log(req.query)
    if (req.query.business_id){
      console.log("we are going to find all them posts that match the business id " + req.query.business_id)
      theFilter.business_id = req.query.business_id
    }
    Post.find(theFilter, (err, posts) => {
      res.json(posts)})
    })
   .post((req, res) => {
      var newPost = new Post(req.body)
      newPost._author = req._author = req.user
      newPost.save((err, post) => res.json(post))
    })

  postRouter.route('/:id')
  .delete((req, res) => {
    Post.findByIdAndRemove(req.params.id , (err) =>{
      if (err) console.log(err)
      res.json({message: "deleted"})
    })
  })
module.exports = postRouter
