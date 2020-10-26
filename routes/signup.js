/**
 * The ejs file already handles: empty input, email format (@) checking;
 * Currently only consider the password to be non-hashed.
 */
const bcrypt = require('bcrypt');
const saltRounds = 10;

exports.trySignup = async (req, res) => {
	const client = await global.pool.connect();
	var email = req.body.userEmail;
	var password1 = req.body.userPassword;
	var password2 = req.body.confirmPassword;
	if (email && password1 && password2) {
		if (password1 != password2) {
			res.send('Please check your password');
			res.end();
		} else {
			const REGISTER_USER = `INSERT INTO users (email, password) VALUES('${email}', '${password2}');`;
			await client.query(REGISTER_USER);
			res.redirect("/login");
			client.release();
		}
	} else {
		res.end();
	}
};