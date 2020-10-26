const SOME_QUERY = 'SOME QUERY';

exports.tryLogin = (req, res) => {
	var email = req.body.userEmail;
	var password = req.body.userPassword;
	console.log(email + ' ' + password);
	if (email && password) {
		// verify
		res.redirect("/home");
	} else {
		res.send('Please enter your email and password');
		res.end();
	}
};


