const SOME_QUERY = 'SOME QUERY';

exports.trySignup = (req, res) => {
	var email = req.body.userEmail;
	var password1 = req.body.userPassword;
	var password2 = req.body.confirmPassword;
	console.log(email + ' ' + password1 + ' ' + password2);
	if (email && password1 && password2) {
		if (password1 != password2) {
			res.send('Please check your password');
			res.end();
		}
		// create account
		res.redirect("/login");
	} else {
		res.send('Please enter your information');
		res.end();
	}
};


