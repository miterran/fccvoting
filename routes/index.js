const User = require('../models/user');
const Pp = require('./passport.js');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

module.exports = function(app, passport){

	app.get('/', function(req, res){
		res.render('index', {currentUser: res.locals.user, 
							 title: 'FCC Voting'});
	});

	app.get('/mypoll', Pp.ensureAuthenticated, function(req, res){
		res.render('mypoll', {currentUser: res.locals.user, 
							  title: 'My Polls'});
	});

	app.get('/newpoll', Pp.ensureAuthenticated, function(req, res){
		res.render('newpoll', {currentUser: res.locals.user, 
							   title: 'Post a New Poll'});
	});

	app.post('/newpoll', function(req, res){
		res.redirect('/newpoll')
	});

	app.get('/register', function(req, res){
		errorReg = false;
		res.render('register', {currentUser: res.locals.user, 
								title: 'Register'});
	});

	app.post('/register', function(req, res){
		let username = req.body.username;
		let email = req.body.email;
		let password = req.body.password;
		let password2 = req.body.password2;

		req.checkBody('username', 'Name is required').notEmpty();
		req.checkBody('email', 'Email is required').notEmpty();
		req.checkBody('email', 'Email is not valid').isEmail();
		req.checkBody('password', 'Password is required').notEmpty();
		req.checkBody('password2', 'Password do not match').equals(password);

		errorReg = req.validationErrors();

		if(errorReg){
			req.flash('alert alert-danger', errorReg);
			res.render('register', {currentUser: res.locals.user,
									title: 'Register'});

		}else{
			let newUser = new User({
				username: username,
				email: email,
				password: password
			});

			User.findOne({username: username, email: email}).then(function(result){
				if(result !== null){
					req.flash('alert alert-danger', 'username or email has already used');
					res.redirect('/register');
				}else{
					var newUser = new User({
						username: username,
						email: email,
						password: password
					});
					newUser.save(function(err, user){
						req.flash('alert alert-success', 'account created, please login now');
						res.redirect('/signin');
					});
				}
			});
		};
	});

	passport.use(new LocalStrategy(function(username, password, done) {
	    User.getUserByUserName(username, function(err, user){
	    	if(err) throw err;
	    	if(!user){
	    		console.log(err);
	    		return done(null, false, {message: 'Unknow User'});
	    	}
	    	console.log(user);
	    	User.comparePassword(password, user.password, function(err, isMatch){
	    		if(err) throw err;
	    		if(isMatch){
	    			return done(null, user);
	    		}else{
	    			return done(null, false, {message: 'Invalid password'});
	    		}
	    	});
	    });
	}));

	passport.serializeUser(function(user, done) {
	  done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
	  User.getUserById(id, function(err, user) {
	    done(err, user);
	  });
	});

	app.get('/signin', function(req, res){ 
		res.render('signin', {currentUser: res.locals.user, 
							  title: 'Sign in'});
	});

	app.post('/signin', passport.authenticate('local', {successRedirect: '/', failureRedirect:'/signin', failureFlash: true, successFlash: "Welcome!"}),function(req, res){
		res.redirect('/signin');
	});

	app.get('/logout', Pp.ensureAuthenticated, function(req, res){
		req.logOut();
		res.redirect('/');
	});
	
}
