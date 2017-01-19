const
  dotenv = require('dotenv').load({silent: true}),
  express = require('express'),
  mongoose = require('mongoose'),
  flash = require('connect-flash'),
  logger = require('morgan'),
  cookieParser = require('cookie-parser'),
  session = require('express-session'),
  MongoDBStore = require('connect-mongodb-session')(session),
  passport = require('passport')
  request = require('request'),
  ejs = require('ejs'),
  ejsLayouts = require('express-ejs-layouts'),
  bodyParser = require('body-parser'),
  oauthSignature = require('oauth-signature'),
  n = require('nonce')(),
  qs = require('querystring'),
  _ = require('lodash'),
  port  = (process.env.PORT || 3000),


// //   // environment port
// // const
// //   // port = process.env.PORT || 3000,
  mongoConnectionString = process.env.MONGODB_URL || 'mongodb://localhost/passport-authentication'

    // mongoose connection
    mongoose.connect(mongoConnectionString, (err) => {
      console.log(err || "Connected to MongoDB (passport-authentication)")
    })

    // will store session information as a 'sessions' collection in Mongo
const store = new MongoDBStore({
  uri: mongoConnectionString,
  collection: 'sessions'
    });

  //middleware
  app = express()
  app.use(express.static(__dirname + '/public'))
  app.use(logger('dev'))
  app.use(cookieParser())
  app.use(bodyParser.urlencoded({extended: true}))
  app.use(bodyParser.json())
  app.use(flash())
  app.use(session({
	   secret: 'boooooooooom',
	   cookie: {maxAge: 60000000},
	   resave: true,
	   saveUninitialized: false,
	   store: store
  }))
  app.use(passport.initialize())
  app.use(passport.session())
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
      location: 'Santa+Monica',
      sort: '2'
    };

    /* We set the require parameters here */
    var required_parameters = {
      oauth_consumer_key : process.env.OAUTH_CONSUMER_KEY,
      oauth_token : process.env.oauth_token,
      oauth_nonce : n(),
      oauth_timestamp : n().toString().substr(0,10),
      oauth_signature_method : 'HMAC-SHA1',
      oauth_version : '1.0'
    };

    /* We combine all the parameters in order of importance */
    var parameters = _.assign(default_parameters, set_parameters, required_parameters);

    /* We set our secrets here */
    var consumerSecret = process.env.consumerSecret;
    var tokenSecret = process.env.tokenSecret;

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

  app.get('/search' , (req, res) => {
    if (req.query.location){
    request_yelp({term:'happy+hour', location:req.query.location}, function(error, response, body){
      console.log(body);
      var businesses = JSON.parse(body).businesses
      var businessesJustTheGoodStuff = businesses.map((b) => {
        return {name: b.name, id: b.id, rating: b.rating, location: b.location}
      })
      // res.json(businesses)
      res.render('pages/search', {businesses: businessesJustTheGoodStuff})
      // res.json(businessesJustTheGoodStuff)
    })} else {
      res.redirect('/')
    }
  })


  // // currentUser:
  app.use((req, res, next) => {
	app.locals.currentUser = req.user
	app.locals.loggedIn = !!req.user

	next()
  })
  //
  // ejs configuration
  app.set('view engine', 'ejs')
  app.use(ejsLayouts)

  //root route
  app.get('/', (req, res) => {
  	res.render('pages/home')
  })

  // app.get('/search', (req, res) => {
  //   res.render('pages/search')
  // })

  app.listen(port, (err) => {
    console.log (err || "Server Running On Port " + port)
  })
