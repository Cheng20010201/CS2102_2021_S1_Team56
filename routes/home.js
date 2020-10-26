const GET_COLLABORATORS = 'SELECT * FROM collaborators;';

exports.show = (req, res) => {
	res.render("pages/home");
};


