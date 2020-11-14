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
			const client = global.client;
			var GET_USER = `SELECT * FROM petowner WHERE email='${req.session.email}'`;
			var result = await client.query(GET_USER);
			var tempUser = (result.rows)[0];
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
				const client = global.client;
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
		const client = global.client;
		const GET_BIDS = `SELECT b.name, b.startdate, b.duration, b.ctemail, b.price FROM bids as b WHERE b.poemail='${req.session.email}' and b.success=true;`;
		const tempHistory = (await client.query(GET_BIDS)).rows;
		res.render("pages/po-history", { title: "User List", userData: tempHistory });
	} else {
		res.redirect("/login");
	}
}

exports.review = async (req, res) => {
	if (req.session.loggedin) {
		// retrive user data
		var i = req.params.id - 1;
		const client = global.client;
		const GET_RATING = `SELECT b.rating, b.reviews FROM bids as b WHERE b.poemail='${req.session.email}' and b.success=true;`;
		var result = (await client.query(GET_RATING)).rows;
		const tempReview = result[i];

		const GET_BIDS = `SELECT b.name, b.startdate, b.duration, b.ctemail, b.price FROM bids as b WHERE b.poemail='${req.session.email}' and b.success=true;`;
		result = (await client.query(GET_BIDS)).rows;
		// a hack here
		req.session.pet = { name: '', date: '' };
		req.session.pet.name = result[i].name;
		req.session.pet.date = result[i].startdate;
		// console.log(result[i]);
		// console.log(req.session.pet);
		res.render("pages/po-review", { user: tempReview });
	} else {
		res.redirect("/login");
	}
}

exports.saveReview = async (req, res) => {
	if (req.session.loggedin) {
		try {
			const client = global.client;
			var rating = req.body.rating;
			var review = req.body.review;
			var name = req.session.pet.name;
			var date = req.session.pet.date.substring(0, 10);
			req.session.pet = undefined;
			var email = req.session.email;
			// console.log(date);
			const UPDATE_RATING = `
			UPDATE bids SET rating=${rating}, reviews='${review}' WHERE poemail='${email}' AND 
			name='${name}' AND startDate=(date('${date}')+1);`;
			client.query(UPDATE_RATING);
			res.redirect('/petowner');
		} catch (err) {
			console.log(err);
			res.send('Update failure. You need to make sure that the rating is in range.');
		}
	} else {
		res.redirect("/login");
	}
}


exports.pets = async (req, res) => {

	if (req.session.loggedin) {
		// retrive user data
		try {
			const client = global.client;
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
		const client = global.client;
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
			const client = global.client;
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

exports.book = async (req, res) => {
	// get pet names
	if (req.session.loggedin) {
		const client = global.client;
		var GET_PET = `SELECT name FROM pet WHERE poemail='${req.session.email}'`;
		const result = (await client.query(GET_PET)).rows;
		res.render("pages/po-book", { title: "User List", userData: result });
	} else {
		res.redirect("/login");
	}
};

exports.searchCareTaker = async (req, res) => {
	if (req.session.loggedin) {
		try {
			var name = req.body.pet;
			var date = req.body.startDate;
			var duration = req.body.duration;
			var price = req.body.price;
			var transfer = req.body.transfer;
			var payment = req.body.payment;
			// hack here
			var bidInfo = {};
			bidInfo.name = name;
			bidInfo.date = date;
			bidInfo.duration = duration;
			bidInfo.price = price;
			bidInfo.transfer = transfer;
			bidInfo.payment = payment;
			req.session.bidInfo = {};
			req.session.bidInfo = bidInfo;
			/** CT has to be: 1. capable of this type of pet; 2. available for the whole duration */
			const GET_CT = `
				SELECT DISTINCT ct.cname, ct.email, ct.rating, ct.area
				FROM caretaker ct 
				WHERE ((SELECT type FROM pet WHERE poemail='${req.session.email}' AND name='${name}') IN (SELECT type FROM capable WHERE ctemail=ct.email))
				AND (SELECT * FROM available('ct.email', '${date}', ${duration})=TRUE);
			`;
			const client = global.client;
			const result = (await client.query(GET_CT)).rows;
			res.render("pages/po-select-ct", { title: "User List", userData: result });
		} catch (err) {
			res.send("database error");
			console.log(err);
		}
	} else {
		res.redirect("/login");
	}
}

exports.selectCareTaker = async (req, res) => {
	if (req.session.loggedin) {
		try {
			// same hack
			const index = req.params.id - 1;
			const GET_CT = `
				SELECT DISTINCT ct.email, ct.cname
				FROM caretaker ct 
				WHERE ((SELECT type FROM pet WHERE poemail='${req.session.email}' AND name='${req.session.bidInfo.name}') IN (SELECT type FROM capable WHERE ctemail=ct.email))
				AND (SELECT * FROM available('ct.email', '${date}', ${duration})=TRUE);
			`;
			const client = global.client;
			var temp = ((await client.query(GET_CT)).rows)[index];
			var ctemail = temp.email;
			var cname = temp.cname;
			req.session.bidInfo.caretaker = cname;
			req.session.bidInfo.ctemail = ctemail;
			res.redirect("/petOwner/bidinfo");
		} catch (err) {
			res.send('possibly database error')
		}
	} else {
		res.redirect("/login");
	}
};

exports.bidInfo = (req, res) => {
	if (req.session.loggedin) {
		// show stored values
		var bidInfo = {};
		bidInfo.date = req.session.bidInfo.date;
		bidInfo.duration = req.session.bidInfo.duration;
		bidInfo.price = req.session.bidInfo.price;
		bidInfo.transfer = req.session.bidInfo.transfer;
		bidInfo.payment = req.session.bidInfo.payment;
		bidInfo.caretaker = req.session.bidInfo.caretaker;
		var tempBid = [bidInfo];
		res.render("pages/po-bidinfo", { title: "User List", userData: tempBid });
	} else {
		res.redirect("/login");
	}
};

exports.confirmBidInfo = async (req, res) => {
	if (req.session.loggedin) {
		try {
			const client = global.client;
			const INSERT_BID = `
					INSERT INTO bids 
					(startDate, endDate, ctemail, name, poemail, duration, transfer_method, payment_method, price)
					VALUES
					('${req.session.bidInfo.date}', 
					date('${req.session.bidInfo.date}') + ${req.session.bidInfo.duration}, 
					'${req.session.bidInfo.ctemail}', 
					'${req.session.bidInfo.name}', 
					'${req.session.email}', 
					${req.session.bidInfo.duration}, 
					'${req.session.bidInfo.transfer}', 
					'${req.session.bidInfo.payment}', 
					${req.session.bidInfo.price});
				`;
			await client.query(INSERT_BID);
			req.session.bidInfo = undefined; // life cycle ends
			res.redirect("/petOwner");
		} catch (err) {
			res.send(`
				Something wrong happens because of one or more of the following: 
				your bidding price is too low for the selected caretaker;
				you do not have a credit card yet.
			`
			);
		}
	} else {
		res.redirect("/login");
	}
};

exports.findNearby = async (req, res) => {
	if (req.session.loggedin) {
		// retrive user data
		try {
			const client = global.client;
			var GET_NEARBY =
				`SELECT email, pname AS name, 'petowner' AS type FROM petowner WHERE area=(SELECT area FROM petowner WHERE email='${req.session.email}')
			and email!='${req.session.email}' 
			UNION 
			SELECT email, cname AS name, 'caretaker' AS type FROM caretaker WHERE area=(SELECT area FROM petowner WHERE email='${req.session.email}')
			and email!='${req.session.email}'`;
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