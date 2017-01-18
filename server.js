const
  dotenv = require('dotenv').load({silent: true}),
  express = require('express'),
  request = require('request'),
  ejs = require('ejs'),
  ejsLayouts = require('express-ejs-layouts'),
  bodyParser = require('body-parser'),
  oauthSignature = require('oauth-signature'),
  n = require('nonce')(),
  qs = require('querystring'),
  _ = require('lodash'),
  port  = (process.env.PORT || 3000),


  app = express()
  /* Function for yelp call
   * ------------------------
   * set_parameters: object with params to search
   * callback: callback(error, response, body)
   */
  var request_yelp = function(set_parameters, callback) {

    /* The type of request */
    var httpMethod = 'GET';

    /* The url we are using for the request */
    var url = 'http://api.yelp.com/v2/search';

    /* We can setup default parameters here */
    var default_parameters = {
      location: 'San+Francisco',
      sort: '2'
    };

    /* We set the require parameters here */
    var required_parameters = {
      oauth_consumer_key :'P6Yc3unbPEtA9s1ThtBxUQ', // process.env.oauth_consumer_key,
      oauth_token : 's6Mun8nEr1zJ0GfeYx5FMRsmdMifW1HV', //process.env.oauth_token,
      oauth_nonce : n(),
      oauth_timestamp : n().toString().substr(0,10),
      oauth_signature_method : 'HMAC-SHA1',
      oauth_version : '1.0'
    };

    /* We combine all the parameters in order of importance */
    var parameters = _.assign(default_parameters, set_parameters, required_parameters);

    /* We set our secrets here */
    var consumerSecret = 'Xmk63rKGgR5HAUz6j2vckwE27aE'//process.env.consumerSecret;
    var tokenSecret = 'gJkVI8VYYtP97nfy5ujGFTfthYE'// process.env.tokenSecret;

    /* Then we call Yelp's Oauth 1.0a server, and it returns a signature */
    /* Note: This signature is only good for 300 seconds after the oauth_timestamp */
    var signature = oauthSignature.generate(httpMethod, url, parameters, consumerSecret, tokenSecret, { encodeSignature: false});

    /* We add the signature to the list of paramters */
    parameters.oauth_signature = signature;

    /* Then we turn the paramters object, to a query string */
    var paramURL = qs.stringify(parameters);

    /* Add the query string to the url */
    var apiURL = url+'?'+paramURL;

    /* Then we use request to send make the API Request */
    request(apiURL, function(error, response, body){
      return callback(error, response, body);
    });
  };

  app.get('/restaurants/:location' , (req, res) => {
    request_yelp({term:'food', location:req.params.location}, function(error, response, body){
      //console.log(error, response, body);
      res.json(JSON.parse(body))
    })
  })

  // ejs configuration
  app.set('view engine', 'ejs')
    // app.use(ejsLayouts)

  //root route
  app.get('/', (req, res) => {
  	res.render('pages/home')
  })

  app.listen(port, (err) => {
    console.log (err || "Server Runnign On Port " + port)
  })
