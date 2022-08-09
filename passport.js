const { Model, models } = require('mongoose');
const passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    Models = require('./models.js'),
    passportJWT = require('passport-jwt');

let Users = Models.User,
    JWTStrategy = passportJWT.Strategy,
    ExtractJwt = passportJWT.ExtractJwt;

passport.use(new LocalStrategy({
    usernameField : 'Username',
    passwordField : 'Password'
},
(username,password,callback) =>{
    console.log(username+ ' '+ password);
    Users.find({Username : username},(error,user) => {
        if(error){
            console.log('Error'+ error);
            return callback(error);
        }
        if(!user){
            console.log('Incorrect Username');
            return callback(null,false,{message : 'Incorect Username or password'});
        }
        console.log('finished');
        return callback(null,user)
    });
}));

passport.use(new JWTStrategy({
    jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey : 'your_jwt_secret'
},(jwtPayload,callback)=>{
    return Users.findById(jwtPayload._id)
    .then((user)=>{
        return callback(null,user);
    })
    .catch((error) => {
        return callback(error)
    });

}));