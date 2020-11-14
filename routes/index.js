const HELLO = 'Hello, this is CS2102 group 56!'
const GET_COLLABORATORS = 'SELECT * FROM collaborators;';

// homepage
exports.home = async (req, res) => {
	global.client = await global.pool.connect();
	if (req.session.loggedin) {
		res.redirect(`/${req.session.type}`);
	} else {
		res.render("pages/index");
	}
	res.end();
};

// hello message
exports.hello = (req, res) => res.send(HELLO);
// about us
exports.aboutus = async (req, res) => {
	try {
		const client = global.client;
		const result = await client.query(GET_COLLABORATORS);
		const results = { 'results': (result) ? result.rows : null };
		res.render('pages/collaborators', results);
	} catch (err) {
		console.error(err);
		res.send("Error " + err);
	}
};
// login page
exports.login = (req, res) => res.render('pages/login');
// signup page
exports.signup = (req, res) => res.render('pages/signup_init');
// logout procedure
exports.logout = (req, res) => {
	req.session.loggedin = false;
	req.session.email = undefined;
	req.session.type = undefined;
	res.redirect('/');
	res.end;
};