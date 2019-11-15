const mongoose = require('mongoose');
const User = mongoose.model('User');

exports.validateSignup = (req, res, next) => {
  //1.Sanatize the inputs to ensure the user is not sending over something melicious
  //sanitizeBody is given to us on the req because of our express validata middleware
  req.sanitizeBody('name')
  req.sanitizeBody('email')
  req.sanitizeBody('password')
   
   //Conditions check if the name is !null & is 10 charachters
  req.checkBody('name', 'Enter a name').notEmpty();
  req.checkBody('name', 'Name must be between 4 & 10 characters').isLength({min:4, max:10})
  req.checkBody('password', 'password must be between 4 & 10 characters').isLength({min:4, max:10})

  //Email us !null & valid & normilized
  req.checkBody('email', 'Enter a valid email').isEmail().normalizeEmail()

  //req.validationErrors(); will put all of our error into an array
  const errors = req.validationErrors();
  if(errors) {
    const firstError = errors.map(error => error.msg)[0];
    return res.status(400).send(firstError);
  } else {
    //Call the next function inline which will be signup if there is no errors
    next();
  }
}; // Middleware that will determine if are fields are valid

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;
  //Using the User model we brought in
  const user = await new User({name, email, password});
  //Passport 1. hash password 2.Turn into long crypted string 3. wont save password just hash 4. Automatically call .save() for us
  await user.register(user, password, (err, user) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.json(user);
  })
};

exports.signin = () => {};

exports.signout = () => {};

exports.checkAuth = () => {};
