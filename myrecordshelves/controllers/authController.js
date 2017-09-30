const passport = require('passport');

exports.login = passport.authenticate('local', {
	failureRedirect: '/login',
	failureFlash: 'Failed login!',
	successRedirect: '/',
	successFlash: 'You are now logged in!'
})

exports.logout = (req, res) => {
	req.logout();
	req.flash('success', 'You have logged out!');
	res.redirect('/');
}