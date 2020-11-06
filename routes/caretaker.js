exports.show = (req, res) => {
    if (req.session.loggedin) {
        res.render("pages/caretaker");
    } else {
        res.redirect("/login");
    }
};

exports.profile = async (req, res) => {
	if (req.session.loggedin) {
		// retrive user data
		try {
            /*
            const client = await global.pool.connect();
			var GET_USER = `SELECT * FROM caretaker WHERE email='${req.session.email}'`;
			var result = await client.query(GET_USER);
			var tempUser = (result.rows)[0];
            // since "saveProfiel" must be done after "getProfile", 
			// then we can just store the data in session for later usage
            req.session.profileData = tempUser
            */
           var tempUser = {
                cname: "adi",
                area: "Kent Ridge",
                phonenum: 12345678,
                worktime: "full time",
                rating: 4.5,
                petnum: 3
           }
			res.render("pages/ct-profile", { user: tempUser });
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
            console.log(req.body);
			// to update values
			var cname = req.body.userName;
			var area = req.body.userArea;
			var phonenum = req.body.userTel;
			if (phonenum.length !== 8) {
				res.send('Phone number can only be 8 digits long.');
			} else if (!(cname && area && phonenum)) {
				res.send('Name, area, phone number cannot be left blank.');
			} else {    
                /*
				// be able to update
				const client = await global.pool.connect();
				const UPDATE = `UPDATE caretaker SET cname='${pname}', area='${area}', phonenum='${phonenum}' WHERE email='${req.session.email}';`;
                await client.query(UPDATE);
                */
                res.redirect('/caretaker');
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
        /*
		// retrive user data
		const client = await global.pool.connect();
		const GET_BIDS = `SELECT b.name, b.startdate, b.duration, b.poemail, b.price, b.rating FROM bids as b WHERE b.ctemail='${req.session.email}' and b.success=true;`;
        const tempHistory = (await client.query(GET_BIDS)).rows;
        */
       var tempHistory = [
           {
               name: 'Pikachu',
               startdate: '2020/12/24',
               duration: 3,
               poemail: 'alice@example.com',
               price: 30,
               rating: 4.5
           }, {
                name: 'Pikachu',
                startdate: '2020/12/30',
                duration: 7,
                poemail: 'catherine@example.com',
                price: 65,
                rating: ''
            } 
        ]
		res.render("pages/ct-history", { title: "User List", userData: tempHistory });
	} else {
		res.redirect("/login");
	}
}

exports.salary = async (req, res) => {
	if (req.session.loggedin) {
		// retrive user data
		try {
           var tempSalary = [
                {
                    month: '2020-10',
                    salary: 2000
                }, {
                    month: '2020-9',
                    salary: 1820
                }
            ]
			res.render("pages/ct-salary", { title: "User List", userData: tempSalary });
		} catch (err) {
			res.end();
		}
	} else {
		res.redirect("/login");
	}
};

exports.book = async (req, res) => {
	if (req.session.loggedin) {
		// retrive user data
		try {
           var tempBids = [
                {
                    name: 'Pikachu',
                    type: 'mouse',
                    startdate: '2021/1/8',
                    duration: 3,
                    poemail: 'alice@example.com',
                    price: 30,
                }, {
                    name: 'Charmander',
                    type: 'lizzard',
                    startdate: '2020/12/30',
                    duration: 7,
                    poemail: 'catherine@example.com',
                    price: 65,
                }
            ]
			res.render("pages/ct-book", { title: "User List", userData: tempBids });
		} catch (err) {
			res.end();
		}
	} else {
		res.redirect("/login");
	}
};

exports.accept = (req, res) => {
    if (req.session.loggedin) {
        // mark bid as successful
        console.log("marked as successful");
        res.redirect('/caretaker');
    } else {
        res.redirect("/login");
    }
};

exports.reject = (req, res) => {
    if (req.session.loggedin) {
        // mark bid as unsuccessful
        console.log("marked as unsuccessful");
        res.redirect('/caretaker');
    } else {
        res.redirect("/login");
    }
};

exports.monthly = async (req, res) => {
    if (req.session.loggedin) {
        try {
            /*
			const client = await global.pool.connect();
			var GET_MONTHLY = // help me out
            var result = await client.query(GET_MONTHLY);
            var summary = result.rows;
            */
			var summary = {
                care: 20,
                pet: 17,
                petday: 58,
                salary: 1920
            }
			res.render("pages/ct-monthly", { data: summary });
		} catch (err) {
			console.log(err);
			res.send("Possible database error.");
		}
    } else {
        res.redirect("/login");
    }
}