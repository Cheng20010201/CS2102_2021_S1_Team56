exports.show = (req, res) => {
	if (req.session.loggedin) {
		res.render("pages/petowner");
	} else {
		res.redirect("/login");
	}
};

exports.profile = async (req, res) => {
	if (req.session.loggedin) {
		// retrive user data
		try {
			const client = await global.pool.connect();
			var GET_USER = `SELECT * FROM petowner WHERE email='${req.session.email}'`;
			var result = await client.query(GET_USER);
			var tempUser = (result.rows)[0];
			// since "saveProfiel" must be done after "getProfile", 
			// then we can just store the data in session for later usage
			req.session.profileData = tempUser
			res.render("pages/po-profile", { user: tempUser });
		} catch (err) {
			res.end();
		}
	} else {
		res.redirect("/login");
	}
};

exports.saveProfile = async (req, res) => {
	if (req.session.loggedin) {
		try {
			// to update values
			var pname = req.body.userName;
			var area = req.body.userArea;
			var phonenum = req.body.userTel;
			var creditnum = req.body.userCreditNum;
			if (phonenum.length !== 8) {
				res.send('Phone number can only be 8 digits long.');
			} else if (!(pname && area && phonenum)) {
				res.send('Name, area, phone number cannot be left blank.');
			} else {
				// be able to update
				const client = await global.pool.connect();
				const UPDATE = `UPDATE petowner SET pname='${pname}', area='${area}', phonenum='${phonenum}', creditnum='${creditnum}' WHERE email='${req.session.email}';`;
				await client.query(UPDATE);
				res.redirect('/petOwner');
			}
		} catch (err) {
			console.log(err);
			res.send('Update failure.');
		}
	} else {
		res.redirect("/login");
	}
	res.end();
}

exports.history = (req, res) => {

	if (req.session.loggedin) {
		// retrive user data
		var tempHistory = [
			{
				pet: 'Pikachu',
				date: '2020-01-01',
				duration: 3,
				caretaker: 'adi',
				price: 20,
				id: 1
			}, {
				pet: 'Mewtwo',
				date: '2020-06-01',
				duration: 5,
				caretaker: 'adi',
				price: 30,
				id: 2
			}
		]
		res.render("pages/po-history", { title: "User List", userData: tempHistory });
	} else {
		res.redirect("/login");
	}
}


exports.pets = (req, res) => {

	if (req.session.loggedin) {
		// retrive user data
		var tempPets = [
			{
				name: 'Pikachu',
				gender: 'male',
				age: 3,
				specreq: 'charge regularly',
				id: 1
			}, {
				name: 'Squitle',
				gender: 'female',
				age: 2,
				specreq: '',
				id: 2
			}
		]
		res.render("pages/po-pets", { title: "User List", userData: tempPets });
	} else {
		res.redirect("/login");
	}
}