exports.tryLogin = async (req, res) => {
	try {
		// const client = await global.pool.connect();		
		const client = global.client;
		var email = req.body.userEmail;
		var password = req.body.userPassword;
		var type = req.body.userType;

		if (email && password && type) {
			var CHECK_USER_EXISTS = `SELECT 1 FROM users WHERE email='${email}' AND password='${password}';`;
			var result = await client.query(CHECK_USER_EXISTS);
			var results = { 'results': (result) ? result.rows : null };
			if (results["results"].length === 0) {
				res.send('Incorrect email and/or Password.');
			} else {
				// have account
				// then need to verify type information
				var CHECK_TYPE;
				if (type == 'petOwner') {
					CHECK_TYPE = `SELECT 1 FROM petowner WHERE email='${email}';`;
				} else if (type == 'careTaker') {
					CHECK_TYPE = `SELECT 1 FROM caretaker WHERE email='${email}';`;
				} else {
					CHECK_TYPE = `SELECT 1 FROM pcsadmin WHERE email='${email}';`;
				}
				result = await client.query(CHECK_TYPE);
				results = { 'results': (result) ? result.rows : null };
				if (results["results"].length === 0) {
					res.send('Incorrect email and/or Password.');
				} else {
					req.session.loggedin = true;
					req.session.email = email;
					req.session.type = type;
					res.redirect(`/${type}`);
				}
			}
		} else {
			res.send('Please enter all information.');
		}
		res.end();
	} catch (err) {
		console.log(err);
		res.send('Unexpected error.');
	}
	/*
	req.session.loggedin = true;
	req.session.email = 'sunyuchengsyc@163.com';
	req.session.type = 'caretaker';
	res.redirect('/caretaker');*/

};