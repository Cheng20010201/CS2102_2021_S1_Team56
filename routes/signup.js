exports.signUpInit = (req, res) => {
	try {
		const userType = req.body.userType;
		if (userType == "petOwner") {
			res.render('pages/signupPo');
		} else {
			res.render('pages/signupCt');
		}
		res.end();
	} catch (err) {
		res.end();
	}
};

exports.trySignupPo = async (req, res) => {
	try {
		const client = await global.pool.connect();
		// only need to check: 
		// phone number is of length 8
		// whether credit number is defined
		var email = req.body.userEmail;
		var password1 = req.body.userPassword;
		var password2 = req.body.confirmPassword;
		var userName = req.body.userName;
		var phoneNum = req.body.phoneNum;
		var area = req.body.area;
		var creditNum = req.body.creditNum;
		if (phoneNum.length !== 8) {
			res.send('Phone number can be only 8 digits long.');
		} else if (password1 != password2) {
			res.send('Password mismatch.');
		} else {
			// can register the user
			// need to check whether the user is already inserted
			const CHECK_USER_EXISTS = `SELECT 1 FROM users WHERE email='${email}';`;
			const result = await client.query(CHECK_USER_EXISTS);
			const results = { 'results': (result) ? result.rows : null };
			if (results["results"].length === 0) {
				// not in table 'users'
				const REGISTER_USER = `INSERT INTO users (email, password) VALUES('${email}', '${password2}');`;
				await client.query(REGISTER_USER);
			}

			// now register into pet owners
			// this is the only place where things could go wrong (duplicate records)
			var REGISTER_ACCOUNT;
			if (creditNum === undefined) {
				REGISTER_ACCOUNT = `INSERT INTO petowner (email, pname, phonenum, area) VALUES('${email}', '${userName}', '${phoneNum}', '${area}');`;
			} else {
				REGISTER_ACCOUNT = `INSERT INTO petowner (email, pname, phonenum, creditnum, area) VALUES('${email}', '${userName}', '${phoneNum}', '${creditNum}', '${area}');`;
			}
			await client.query(REGISTER_ACCOUNT);
			res.redirect("/login");
		}
		res.end();
	} catch (err) {
		console.log(err);
		res.send("This email for pet owner may have been occupied... :(");
		res.end();
	}
};

exports.trySignupCt = async (req, res) => {
	try {
		const client = await global.pool.connect();
		// only need to check: 
		// phone number is of length 8
		// whether credit number is defined
		var email = req.body.userEmail;
		var password1 = req.body.userPassword;
		var password2 = req.body.confirmPassword;
		var userName = req.body.userName;
		var phoneNum = req.body.phoneNum;
		var area = req.body.area;
		var timeType = req.body.timeType;
		if (phoneNum.length !== 8) {
			res.send('Phone number can be only 8 digits long.');
		} else if (password1 != password2) {
			res.send('Password mismatch.');
		} else {
			// can register the user
			// need to check whether the user is already inserted
			const CHECK_USER_EXISTS = `SELECT 1 FROM users WHERE email='${email}';`;
			const result = await client.query(CHECK_USER_EXISTS);
			const results = { 'results': (result) ? result.rows : null };
			if (results["results"].length === 0) {
				// not in table 'users'
				const REGISTER_USER = `INSERT INTO users (email, password) VALUES('${email}', '${password2}');`;
				await client.query(REGISTER_USER);
			}

			// now register into pet owners
			// this is the only place where things could go wrong (duplicate records)
			var REGISTER_ACCOUNT = `INSERT INTO caretaker (email, cname, phonenum, area, maxpetnum, timetype) VALUES('${email}', '${userName}', '${phoneNum}', '${area}', '${timeType == 'full time' ? 5 : 2}', '${timeType}');`;

			await client.query(REGISTER_ACCOUNT);
			res.redirect("/login");
		}
		res.end();
	} catch (err) {
		console.log(err);
		res.send("This email for care taker may have been occupied... :(");
		res.end();
	}
};