// const { response } = require('express');
const { response } = require('express');
const User = require('../models/user');


module.exports.profile =function(req,res){
  User.findById(req.params.id, function(err,user){
    return res.render('user_profile', {
      title: 'User Profile',
      profile_user:user
  });

  });
    
}

//Update
module.exports.update = function(req, res){
  if(req.user.id == req.params.id){
      User.findByIdAndUpdate(req.params.id, req.body, function(err, user){
        req.flash('success', 'Updated!'); 
        return res.redirect('back');
      });
  }else{
    req.flash('error', 'Unauthorized!');
      return res.status(401).send('Unauthorized');
  }
}

//render the sign up page
module.exports.signUp = function(req, res){
  if (req.isAuthenticated()){
    // req.flash('success','You are signed Up!')
      return res.redirect('/users/profile/user._id');
  }


  return res.render('user_sign_up', {
      title: "SOCIALcircle | Sign Up"
  });
}

//render the sign in page
module.exports.signIn= function(req, res){
  if(req.isAuthenticated()){
    
     return res.redirect('/users/profile')
  }
    return res.render('user_sign_in',{
        title: 'SOCIALcircle|SignIn'
    });
}
//get the sign up data
module.exports.create = function(req, res){
  if (req.body.password != req.body.confirm_password){
    req.flash('error', 'Passwords do not match');  
    return res.redirect('back');
  }

  User.findOne({email: req.body.email}, function(err, user){
    if(err){req.flash('error', err); return}

      if (!user){
          User.create(req.body, function(err, user){
            if(err){req.flash('error', err); return}

              return res.redirect('/users/sign-in');
          })
      }else{
        req.flash('success', 'You have signed up, login to continue!');
      
          return res.redirect('back');
      }

  });
}
//create sign in AND session user
module.exports.createSession = function(req, res){
  req.flash('success','Logged in Successfully')
  return res.redirect('/');
}

module.exports.destroySession =function(req,res){
  req.logout();
  req.flash('success','You are Logged out!')
  return res.redirect('/');

}
