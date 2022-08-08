const express = require('express'),
      bodyParser = require('body-parser'),
      uuid = require('uuid'),
      app = express();
const mongoose = require('mongoose');
const Models = require('./models.js');      

const Movies = Models.Movie;
const Users = Models.User;
////Connecting Database
mongoose.connect('mongodb://localhost:27017/myFlixdb', { useNewUrlParser: true, useUnifiedTopology: true });

//DB connected using Mongodb
// var MongoClient = require('mongodb').MongoClient;
// var url = 'mongodb://localhost:27017/myFlixdb';

// MongoClient.connect(url, function(err, db) {

//     var cursor = db.collection('Employee').find();

//     cursor.each(function(err, doc) {

//         console.log(doc);

//     });
// });


app.use(bodyParser.json());
// /*

///////////////////////////////////////////////////GET(Read) Queries///////////////////
app.get('/',(req,res) => {
  res.send('ok');
})
//Read movies

app.get('/movies',(req,res) => {
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
app.get('/movies/:title',(req,res) => {
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
app.get('/movies/genre/:genreName',(req,res) => {

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
app.get('/movies/directors/:directorName',(req,res) => {
    Movies.find({'Director.Name' : req.params.directorName})
      .then((movie) => {
        res.status(201).json(movie);
      })
      .catch((err) => {
        console.log(err);
        res.status(401).send('Error ' + err);
      });   
});

///////////////////////////////////////////////////POST (Create)Queries///////////////////
//Add new User
app.post('/users' , (req,res) => {
    Users.findOne({Username : req.body.Username})
      .then((user) => {
        if(user){
          res.status(400).send('User Already exists')
        } else {
          Users
            .create({
              Username: req.body.Username,
              Password: req.body.Password,
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
app.post('/users/:Username/favourite/:movieId' , (req,res) => {
    Users.findOneAndUpdate({Username : req.params.Username},
      {
        $addToSet : {favoriteMovies : req.params.movieId}
      },
      {new :true}),
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
      }
    

    });
///////////////////////////////////////////////////PUT (Update)Queries///////////////////
//Update User Name
app.put('/users/:name' , (req,res) => {
  Users.findOneAndUpdate({Username : req.params.name},
    { 
      $set:
          {
            Username: req.body.Username,
            Password: req.body.Password,
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
app.delete('/users/:name/movies/:movieId' , (req,res) => {
  Users.findOneAndUpdate({Username : req.params.name},
    {
    $pull : {FavouriteMovies : req.params.movieId}
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
app.delete('/users/:name', (req, res) => {
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


app.listen(8080, ()=> console.log('Listening at port 8080'));