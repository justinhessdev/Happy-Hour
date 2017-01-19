const
  dotenv = require('dotenv').load({silent: true}),
  express = require('express'),
  mongoose = require('mongoose'),
  request = require('request'),
  Yelp = require('yelp'),
  ejs = require('ejs'),
  ejsLayouts = require('express-ejs-layouts'),
  bodyParser = require('body-parser'),
  oauthSignature = require('oauth-signature'),
  n = require('nonce')(),
  qs = require('querystring'),
  _ = require('lodash'),
  port  = (process.env.PORT || 3000),


  app = express()


   var yelp = new Yelp({
  consumer_key: process.env.OAUTH_CONSUMER_KEY,
  consumer_secret: process.env.consumerSecret,
  token: process.env.oauth_token,
  token_secret: process.env.tokenSecret,
  });

  app.get('/search' , (req, res) => {
    if (req.query.location){
    yelp.search({term:'happy+hour', location:req.query.location})
    .then(function(data){
     var businesses = data.businesses
     var businessesJustTheGoodStuff = businesses.map((b) => {
     return {name: b.name, id: b.id, rating: b.rating, location: b.location}
     })
     res.render('pages/search', {businesses: businessesJustTheGoodStuff})
    })
  } else {
      res.redirect('/')
    }
  })

  // ejs configuration
  app.set('view engine', 'ejs')
    // app.use(ejsLayouts)

  //root route
  app.get('/', (req, res) => {
  	res.render('pages/home')
  })

  app.get('/show/:id', (req, res) => {
    yelp.business(req.params.id, function(err, data){
      if (err) return console.log(error);
      console.log(data);
      res.render('pages/show', {biz: data})
    });
  })



  app.listen(port, (err) => {
    console.log (err || "Server Running On Port " + port)
  })
