const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

module.exports = {
	ensureAuthenticated: function(req, res, next){
		if(req.isAuthenticated()){
			return next();
		}else{
			req.flash('alert alert-danger', 'Please sign in to access');
			res.redirect('/signin');
		}
	}
}