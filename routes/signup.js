const bcrypt = require('bcrypt');
const saltRounds = 10;

exports.trySignup = async (req, res) => {
	try {
		const client = await global.pool.connect();
		var email = req.body.userEmail;
		var password1 = req.body.userPassword;
		var password2 = req.body.confirmPassword;
		if (email && password1 && password2) {
			if (password1 != password2) {
				res.send('Please check your password');
			} else {
				const REGISTER_USER = `INSERT INTO users (email, password) VALUES('${email}', '${password2}');`;
				const success = await client.query(REGISTER_USER);
				if (success) {
					res.redirect("/login");
				} else {
					res.send('The email may have been occupied... :(');
				}
			}
			res.end();
		} else {
			res.end();
		}
	} catch (err) {
		res.send("This email may have been occupied... :(");
		res.end();
	}
};