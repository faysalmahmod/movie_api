const express = require('express'),
      bodyParser = require('body-parser'),
      uuid = require('uuid'),
      app = express();
const mongoose = require('mongoose');
const Models = require('./models.js');      

const { check, validationResult } = require('express-validator');

const Movies = Models.Movie;
const Users = Models.User;
////Connecting Database
//  mongoose.connect('mongodb://localhost:27017/myFlixdb', { useNewUrlParser: true, useUnifiedTopology: true });



 mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.json());



// app.use(cors());
// app.use(cors()); // Allow all domains to access APi

///List of allowed domains to access API//
const cors = require('cors');
let allowedOrigins = ['http://localhost:8080', 'http://testsite.com','http://localhost:1234','https://api-movie-myflix.herokuapp.com','https://myflixbackend.herokuapp.com','http://localhost:3000'];
app.use(cors({
  origin : (origin,callback) => {
    if(!origin) return callback(null,true);
    if(allowedOrigins.indexOf(origin) === -1){
      let messsage = "The CORS policy for this application doesn’t allow access from origin " + origin;
      return callback(new Error(messsage),false);
    }
    return callback(null,true);
  }
}));


let auth = require('./auth.js')(app);
const passport= require('passport');
require('./passport.js');


///////////////////////////////////////////////////GET(Read) Queries///////////////////
app.get('/',(req,res) => {
  res.send('Welcome to myFlix API');
})
//Read movies using authentication

app.get('/movies',passport.authenticate('jwt', { session: false }),(req,res) => {
   Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send('Error ' + err);
    });
});

//Find movie by name
app.get('/movies/:title',passport.authenticate('jwt',{session:false}),(req,res) => {
    Movies.findOne({Title : req.params.title})
      .then((movie) => {
        res.status(201).json(movie);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).send("Error " + err);
      })
});


//Show movies by genre
app.get('/movies/genre/:genreName',passport.authenticate('jwt',{session:false}),(req,res) => {

    Movies.find({'Genre.Name' : req.params.genreName})
      .then((movie) => {
        res.status(201).json(movie);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).send('Error' + err);
      })

 
});

//Search by Director
app.get('/movies/directors/:directorName',passport.authenticate('jwt',{session:false}),(req,res) => {
    Movies.find({'Director.Name' : req.params.directorName})
      .then((movie) => {
        res.status(201).json(movie);
      })
      .catch((err) => {
        console.log(err);
        res.status(401).send('Error ' + err);
      });   
});
//Get all users data
app.get('/users',passport.authenticate('jwt',{session:false}),(req,res) => {
  Users.find()
   .then((users) => {
     res.status(201).json(users);
   })
   .catch((err) => {
     console.log(err);
     res.status(400).send('Error ' + err);
   });
});

// READ a user by username 
app.get(
  '/users/:username',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Users.findOne({ Username: req.params.username })
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

// READ genre by name
app.get(
  '/genre/:genreName',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Movies.findOne({ 'Genre.Name': req.params.genreName })
      .then((movie) => {
        res.json(movie.Genre);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

// READ director by name
app.get(
  '/directors/:directorName',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Movies.findOne({ 'Director.Name': req.params.directorName })
      .then((movie) => {
        res.json(movie.Director);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

///////////////////////////////////////////////////POST (Create)Queries///////////////////
//Add new User
app.post('/users',[
  check('Username' , 'Username must include min 5 characters').isLength({min:5}),
  check('Username', 'Username contains non-alphanumeric characters which are not allowed').isAlphanumeric(),
  check('Password','Password can not be empty').not().isEmpty(),
  check('Email',"Email doesn't appear to be valid" ).isEmail()
] , (req,res) => {
  let error = validationResult(req);
  if(!error.isEmpty()){
    return res.status(400).json({errors : error.array()});
  }
  let hashedpassword = Users.hashPassword(req.body.Password);
    Users.findOne({Username : req.body.Username})
      .then((user) => {
        if(user){
          res.status(400).send('User Already exists')
        } else {
          Users
            .create({
              Username: req.body.Username,
              Password: hashedpassword,
              Email: req.body.Email,
              Birthday : req.body.Birthday,
            })
            .then((user) => {
              res.status(201).json(user);
            }) 
            .catch((err) => {
              console.log(err);
              res.status(400).send('Error ' + err);
            })
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
    }); 



//Add favourite movie of User
app.post('/users/:Username/favourite/:movieId' ,passport.authenticate('jwt',{session:false}), (req,res) => {
    Users.findOneAndUpdate({Username : req.params.Username},
      {
        $push : { favouriteMovie: req.params.movieId }
      },
      {new :true},
      (err,updatedUser)=> {
        if(err)
        {
          console.error(err);
          console.status(500).send('Error' , err);
        }
        else
        {
          res.json(updatedUser);
        }
      });
    });
///////////////////////////////////////////////////PUT (Update)Queries///////////////////
//Update User Name
app.put('/users/:name' ,[
  check('Username' , 'Username must include min 5 characters').isLength({min:5}),
  check('Username', 'Username contains non-alphanumeric characters which are not allowed').isAlphanumeric(),
  check('Password','Password can not be empty').not().isEmpty(),
  check('Email',"Email doesn't appear to be valid" ).isEmail(),
  check('Birthday','Date is not valid').isDate()
] , passport.authenticate('jwt',{session:false}), (req,res) => {

  let hashpassword = Users.hashPassword(req.body.Password);
  Users.findOneAndUpdate({Username : req.params.name},
    { 
      $set:
          {
            Username: req.body.Username,
            Password: hashpassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          }
  },
  { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

///////////////////////////////////////////////////DELETE Queries///////////////////
//Delete movie from favourite movies of User
app.delete('/users/:name/movies/:movieId' ,passport.authenticate('jwt',{session:false}), (req,res) => {
  Users.findOneAndUpdate({Username : req.params.name},
    {
    $pull : {favouriteMovie : req.params.movieId}
    },
    {new : true},
    (err,updatedUser) =>{
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    });
  });

//////////Delete Existing User
app.delete('/users/:name',passport.authenticate('jwt',{session:false}), (req, res) => {
  Users.findOneAndRemove({ Username: req.params.name })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.name + ' was not found');
      } else {
        res.status(200).send(req.params.name + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
 console.log('Listening on Port ' + port);
});