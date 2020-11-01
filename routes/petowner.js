exports.show = (req, res) => {
	res.render("pages/petowner");
};

exports.profile = (req, res) => {
	
	// retrive user data
	
	var tempUser = {
		name: 'Adi',
		area: 'Kent Ridge',
		tel: 12345678
	}
	res.render("pages/po-profile", {user: tempUser});
};

exports.saveProfile = (req, res) => {
	try{
		console.log(req.body);
		var name = req.body.userName;
		var area = req.body.userArea;
		var tel = req.body.userTel;
		// save user profile

		res.redirect('/petowner');
	} catch (err) {
		console.log(err);
		res.send('Unexpected error.');
	}
}

exports.history = (req, res) => {
	
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
	res.render("pages/po-history", {title: "User List", userData: tempHistory});
}