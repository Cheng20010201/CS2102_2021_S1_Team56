/**
 * The ejs file already handles: empty input, email format (@) checking;
 * Currently only consider the password to be non-hashed.
 */
const bcrypt = require('bcrypt');
const saltRounds = 10;

exports.tryLogin = async (req, res) => {
	try {
		const client = await global.pool.connect();
		var email = req.body.userEmail;
		var password = req.body.userPassword;
		const CHECK_USER_EXISTS = `SELECT 1 FROM users WHERE email='${email}' AND password='${password}';`;
		const result = await client.query(CHECK_USER_EXISTS);
		const results = { 'results': (result) ? result.rows : null };
		if (results["results"].length === 0) {
			res.redirect('/hello');
			client.release();
		} else {
			res.redirect('/home');
			client.release();
			res.end();
		}
	} catch (err) {
		console.log(err);
		res.redirect('/home');
	}
};


