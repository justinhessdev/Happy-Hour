const
  express = require('express'),
  request = require('request'),
  bodyParser = require('body-parser'),
  port  = (process.env.PORT || 3000),

  app = express()

  app.get('/restaurants/:location' , (req, res) => {
    request('http://api.yelp.com/v2/search?location=San+Francisco&oauth_consumer_key=P6Yc3unbPEtA9s1ThtBxUQ&oauth_consumer_secret=Xmk63rKGgR5HAUz6j2vckwE27aE&oauth_token=s6Mun8nEr1zJ0GfeYx5FMRsmdMifW1HV&oauth_token_secret=gJkVI8VYYtP97nfy5ujGFTfthYE', function(error, response, body){
      if (error) {
        throw error
      } else {
        console.log("we got this from yelp: " + response)

        res.json({message: "you requested the places around " + req.params.location, response: response})
      }
    })
  })



app.listen(port, (err) => {
  console.log (err || "Server Runnign On Port " + port)
})
