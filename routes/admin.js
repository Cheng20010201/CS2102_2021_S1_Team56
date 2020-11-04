exports.show = (req, res) => {
	if (req.session.loggedin) {
		res.render("pages/admin");
	} else {
		res.redirect("/login");
	}
};