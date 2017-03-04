const User = require('../models/user');
const Poll = require('../models/poll');
const Pp = require('./passport.js');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

module.exports = function(app, passport){

	app.get('/', function(req, res){
		Poll.find({}).then(function(result){
			res.render('index', {currentUser: res.locals.user, 
								 allPolls: result,
								 title: 'FCC Voting'});
		})
	});

	app.get('/mypoll', Pp.ensureAuthenticated, function(req, res){
		console.log(res.locals.user);
		Poll.find({author: res.locals.user}).then(function(result){
			res.render('mypoll', {currentUser: res.locals.user, 
								  mypolls: result,
								  title: 'My Polls'});
		})
	});

	app.get('/newpoll', Pp.ensureAuthenticated, function(req, res){
		res.render('newpoll', {currentUser: res.locals.user, 
							   title: 'Post a New Poll'});
	});

	app.post('/newpoll', Pp.ensureAuthenticated, function(req, res){
		let author = req.user.username;
		let title = req.body.polltitle;
		let options = [];
		for(let key in req.body){
			options.push(req.body[key]);
		}

		let newPoll = new Poll({
			author: author,
			title: title,
			date: Date(),
			polls: []
		})

		for(let i = 1; i < options.length; i++){
			newPoll.polls.push({options: options[i], count: 0});
		}

		for(let i = 1; i < options.length; i++){
			for(let k = i + 1; k < options.length; k++){
				if(options[i] == options[k]){
					req.flash('alert alert-danger', 'Error: options duplicated');
					return res.redirect('newpoll');
				}
			}
			if(i == options.length-1){
				Poll.findOne({title: title}).then(function(result){
					if(!result){
						newPoll.save().then(function(){
							req.flash('alert alert-success', 'you have created a new poll ' + title);
							res.redirect('vote/' + title);
						});
					}else{
						req.flash('alert alert-danger', 'poll tile has been used');
						res.redirect('newpoll');
					}
				})
			}
		}
	});

	app.post('/delete', Pp.ensureAuthenticated, function(req, res){
		console.log(req.body);
		// Poll.findOneAndRemove({title: req.body.title}).then(function(result){
		// 	console.log(result);
		// 	res.redirect('mypoll');
		// })
		Poll.findOne({title: req.body.title}).then(function(result){
			let depoll = result.title;
			if(result.author == res.locals.user){
				result.remove().then(function(){
					req.flash('alert alert-success', 'you have remove' + depoll);
					res.redirect('mypoll');
				})
			}else{
				console.log('not owner');
				req.flash('alert alert-danger', 'Error: can not delete this poll, you are not the owner');
				res.redirect('vote/'+depoll);
			}
		})
	});

	app.get('/vote/:title', function(req, res){
		    let title = req.params.title;
		    Poll.findOne({title: title}).then(function(result){
				res.render('vote', {currentUser: res.locals.user, 
									title: 'vote',
									author: result.author,
									polltitle: title});
		    })
	});

	app.post('/vote/:title', Pp.ensureAuthenticated, function(req, res){
		let title = req.params.title;
		console.log(req.body);
		console.log(req.params);
		if(parseInt(req.body.options) >= 0){
			Poll.update({'title': req.params.title}, {$inc:{['polls.'+ req.body.options +'.count']: 1}}).then(function(result){
				req.flash('alert alert-success', 'you have voted');
				res.redirect(title);
			})
		}else{
			Poll.findOne({'title': req.params.title}).then(function(result){
				result.polls.push({options: req.body.newoption, count: 0});
				result.save().then(function(){
					req.flash('alert alert-success', 'you have added a new option');
					res.redirect(title);
				})
			})
		}
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
	  done(null, user);
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

	app.post('/signin', passport.authenticate('local', {successRedirect: '/', failureRedirect:'/signin', failureFlash: true, successFlash: "Welcome!"}));

	app.get('/logout', Pp.ensureAuthenticated, function(req, res){
		req.logout();
		res.redirect('/');
	});
	
}
