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

exports.history = async (req, res) => {

	if (req.session.loggedin) {
		// retrive user data
		const client = await global.pool.connect();
		const GET_BIDS = `SELECT b.name, b.startdate, b.duration, b.ctemail, b.price FROM bids as b WHERE b.poemail='${req.session.email}' and b.success=true;`;
		const tempHistory = (await client.query(GET_BIDS)).rows;
		res.render("pages/po-history", { title: "User List", userData: tempHistory });
	} else {
		res.redirect("/login");
	}
}

exports.review = (req, res) => {
	if (req.session.loggedin) {
		// retrive user data
		var tempReview = {
			rating: 4,
			review: 'my Pikachu was taken good care of'
		}
		res.render("pages/po-review", { user: tempReview });
	} else {
		res.redirect("/login");
	}
}

exports.saveReview = (req, res) => {
	if (req.session.loggedin) {
		try {
			// to update values
			console.log(req.body);
			var rating = req.body.rating;
			var review = req.body.review;

		} catch (err) {
			console.log(err);
			res.send('Update failure.');
		}
	} else {
		res.redirect("/login");
	}
}


exports.pets = async (req, res) => {

	if (req.session.loggedin) {
		// retrive user data
		try {
			const client = await global.pool.connect();
			var GET_PET = `SELECT * FROM pet WHERE poemail='${req.session.email}'`;
			var result = await client.query(GET_PET);
			var pets = result.rows;
			res.render("pages/po-pets", { title: "User List", userData: pets });
		} catch (err) {
			console.log(err);
			res.send("Possible database error.");
		}
	} else {
		res.redirect("/login");
	}
}

exports.petsProfile = async (req, res) => {
	if (req.session.loggedin) {
		const client = await global.pool.connect();
		var name = req.params.name;
		var GET_SINGLE_PET = `SELECT * FROM pet WHERE poemail='${req.session.email}' AND name='${name}';`;
		var result = await client.query(GET_SINGLE_PET);
		var pet = (result.rows)[0];
		// for future usage
		req.session.currentPet = name;
		res.render("pages/po-pet-profile", { user: pet });
	} else {
		res.redirect("/login");
	}
};

exports.addPet = (req, res) => {
	if (req.session.loggedin) {
		res.render("pages/po-addpet");
	} else {
		res.redirect("/login");
	}
};

exports.addPetProfile = async (req, res) => {
	if (req.session.loggedin) {
		try {
			// console.log(req.body);
			// to update values
			var name = req.body.petName;
			var type = req.body.petType;
			var gender = req.body.petGender == 'male' ? 'TRUE' : req.body.petGender === undefined ? 'UNKNOWN' : 'FALSE';
			var age = req.body.petAge;
			var specreq = req.body.specReq;
			const client = await global.pool.connect();
			// here we assume the type already has an entry in table "category"
			var ADD_PET;
			if (gender != 'UNKNOWN') {
				ADD_PET = `INSERT INTO pet(name, poemail, type, gender, age, req) VALUES('${name}', '${req.session.email}', '${type}', ${gender}, ${age}, '${specreq}');`;
			} else {
				ADD_PET = `INSERT INTO pet(name, poemail, type, age, req) VALUES('${name}', '${req.session.email}', '${type}', ${age}, '${specreq}');`;
			}
			await client.query(ADD_PET);
			res.redirect('/petOwner');
		} catch (err) {
			console.log(err);
			res.send('Add failure; probably because you specified a non-existing type or you have duplicate pet names.');
		}
	} else {
		res.redirect("/login");
	}
}

exports.savePetProfile = async (req, res) => {
	if (req.session.loggedin) {
		try {
			var name = req.body.petName;
			var type = req.body.petType;
			var gender = req.body.petGender == 'male' ? 'TRUE' : req.body.petGender === undefined ? 'UNKNOWN' : 'FALSE';
			var age = req.body.petAge;
			var specreq = req.body.specReq;
			const client = await global.pool.connect();
			var UPDATE_PET = `UPDATE pet SET name='${name}', type='${type}', gender=${gender}, age=${age}, req='${specreq}' WHERE poemail='${req.session.email}' AND name='${req.session.currentPet}';`;
			await client.query(UPDATE_PET);
			res.redirect('/petOwner');
		} catch (err) {
			console.log(err);
			res.send('Update failure; probably because you specified a non-existing type or you have duplicate pet names.');
		}
	} else {
		res.redirect("/login");
	}
}

exports.book = (req, res) => {
	if (req.session.loggedin) {
		res.render("pages/po-book");
	} else {
		res.redirect("/login");
	}
};

exports.searchCareTaker = (req, res) => {
	if (req.session.loggedin) {
		console.log(req.body);
		var date = req.body.startDate;
		var duration = req.body.duration;
		var price = req.body.price;
		var transfer = req.body.transfer;
		var payment = req.body.payment;
		// the one who initiates this service must be a pet owner
		var bidInfo = { date: date, duration: duration, price: price, transfer: transfer, payment: payment };
		bidInfo.date = date;
		bidInfo.duration = duration;
		bidInfo.price = price;
		bidInfo.transfer = transfer;
		bidInfo.payment = payment;
		// wrap all information in the 'session', for future usage
		req.session.bidInfo = bidInfo;

		// get available caretakers based on bidInfo
		// order by rating desc
		var caretakers = [
			{
				name: "adi",
				rating: 4.5,
				area: "Kent Ridge"
			}, {
				name: "aaron",
				rating: 4.3,
				area: "Downtown Core"
			}
		]
		res.render("pages/po-select-ct", { title: "User List", userData: caretakers });
	} else {
		res.redirect("/login");
	}
}

exports.selectCareTaker = (req, res) => {
	if (req.session.loggedin) {
		// get the selected care taker		
		console.log(req.session.bidInfo);
		res.redirect("/petOwner/bidinfo");

	} else {
		res.redirect("/login");
	}
};

exports.bidInfo = (req, res) => {
	if (req.session.loggedin) {
		// show stored values
		var tempBid = [{
			date: 2020 - 01 - 01,
			duration: 5,
			price: 40,
			transfer: 'deliver',
			payment: 'cash',
			caretaker: 'adi'
		}]
		res.render("pages/po-bidinfo", { title: "User List", userData: tempBid });

	} else {
		res.redirect("/login");
	}
};

exports.confirmBidInfo = (req, res) => {
	if (req.session.loggedin) {
		// write stored values into db
		res.redirect("/petOwner");
	} else {
		res.redirect("/login");
	}
};

exports.findNearby = async (req, res) => {
	if (req.session.loggedin) {
		// retrive user data
		try {
			const client = await global.pool.connect();
			var GET_NEARBY = `SELECT email, pname AS name FROM petowner WHERE area='${req.session.area}' and email!='${req.session.email}' UNION SELECT email, cname AS name FROM caretaker WHERE area='${req.session.area}' and email!='${req.session.email}'`;
			var result = await client.query(GET_NEARBY);
			var nearby = result.rows;
			res.render("pages/po-nearby", { title: "User List", userData: nearby });
		} catch (err) {
			console.log(err);
			res.send("Possible database error.");
		}
	} else {
		res.redirect("/login");
	}
};