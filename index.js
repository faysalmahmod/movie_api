const express = require("express"),
      morgan = require('morgan');
const app = express();

let topMovies = [
    {
      title: 'Animal World',
      year: 2018,
      director: 'Yan Han',
      writers: [
        'Nobuyuki Fukumoto', 
        'Yan Han'
      ],
      stars: [
        'Yifeng Li', 
        'Yunhe Yi', 
        'Bingkun Cao'
      ]
    },
    {
      title: 'Joker',
      year: 2019,
      director: 'Todd Phillips',
      writers: [
        'Todd Phillips', 
        'Scott Silver', 
        'Bob Kane'
      ],
      stars: [
        'Joaquin Phoenix', 
        'Robert De Niro', 
        'Zazie Beetz'
      ]
    },
    {
      title: 'Pulp Fiction',
      year: 1994,
      director: 'Quentin Tarantino',
      writers: [
        'Quentin Tarantino', 
        'Roger Avary'
      ],
      stars: [
        'John Travolta', 
        'Uma Thurman', 
        'Samuel L. Jackson'
      ]
    },
    {
      title: 'Punch-Drunk Love',
      year: 2002,
      director: 'Paul Thomas Anderson',
      writer: 'Paul Thomas Anderson',
      stars: [
        'Adam Sandler', 
        'Emily Watson', 
        'Phillip Seymour Hoffman'
      ]
    },
    {
      title: 'Zodiac',
      year: 2007,
      director: 'David Fincher',
      writer: [
        'James VAnderbilt', 
        'Robert Graysmith'
      ],
      stars: [
        'Jake Gyllenhaal', 
        'Robert Downey Jr.', 
        'Mark Ruffalo'
      ]
    },
    {
      title: 'The Double',
      year: 2013,
      director: 'Richard Ayoade',
      writers: [
        'Fyodor Dostoevsky', 
        'Richard Ayoade', 
        'Avi Korine'
      ],
      stars: [
        'Jesse Eisenberg', 
        'Mia Wasikowska', 
        'Wallace Shawn'
      ]
    },
    {
      title: 'The Big Lebowski',
      year: 1998,
      director: [
        'Joel Coen', 
        'Ethan Coen'
      ],
      writers: [
        'Ethan Coen', 
        'Joel Coen'
      ],
      stars: [
        'Jeff Bridges', 
        'John Goodman', 
        'Julianne Moore'
      ]
    },
    {
      title: 'Amelie',
      year: 2001,
      director: 'Jean-Pierre Jeunet',
      writers: [
        'Guillaume Laurant', 
        'Jean-Pierre Jeunet'
      ],
      stars: [
        'Audrey Tautou', 
        'Mathieu Kassovitz', 
        'Rufus'
      ]
    },
    {
      title: 'Saving Private Ryan',
      year: 1998,
      director: 'Steven Spielberg',
      writer: 'Robert Rodat',
      stars: [
        'Tom Hanks', 
        'Matt Damon', 
        'Tom Sizemore'
      ]
    },
    {
      title: 'Newsies',
      year: 1992,
      director: 'Kenny Ortega',
      writers: [
        'Bob Tzudiker', 
        'Noni White'
      ],
      stars: [
        'Christian Bale', 
        'Bill Pullman', 
        'Robert Duvall'
      ]
    }
  ];

  app.get('/movies', (req,res) => {
    res.json(topMovies);
  }
  );

  app.get('/' , (req, res) => {
    res.send('Welcome to MyFlix');


  });

  app.use(express.static('public'));
  app.use(morgan('common'));

  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('There is some error ');
  });

  app.listen(8080 , () => {
    console.log('MyFlix Server is running');
  })