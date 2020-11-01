//const bcrypt = require('bcrypt');
//const saltRounds = 10;

exports.tryLogin = async (req, res) => {
	try {
		const client = await global.pool.connect();
		console.log(req.body);
		var email = req.body.userEmail;
		var password = req.body.userPassword;
		var type = req.body.userType;
		
		if (email && password && type) {
			const CHECK_USER_EXISTS = `SELECT 1 FROM users WHERE email='${email}' AND password='${password}';`;
			const result = await client.query(CHECK_USER_EXISTS);
			const results = { 'results': (result) ? result.rows : null };
			if (results["results"].length === 0) {
				res.send('Incorrect email and/or Password.');
				client.release();
			} else {
				req.session.loggedin = true;
				req.session.email = email;
				res.redirect(`/${type}`);
				client.release();
			}

		} else {
			res.send('Please enter all information.');
		}
		res.end();
	} catch (err) {
		console.log(err);
		res.send('Unexpected error.');
	}
};