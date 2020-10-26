const HELLO = 'Hello, this is CS2102 group 56!'
const GET_COLLABORATORS = 'SELECT * FROM collaborators;';

// homepage
exports.home = (req, res) => res.render('pages/index');
// hello message
exports.hello = (req, res) => res.send(HELLO);
// about us
exports.aboutus = async (req, res) => {
		try {
			const client = await global.pool.connect();
			const result = await client.query(GET_COLLABORATORS);
			const results = { 'results': (result) ? result.rows : null};
			res.render('pages/collaborators', results );
			client.release();
		} catch (err) {
			console.error(err);
			res.send("Error " + err);
		}
	};
// login page
exports.login = (req, res) => res.render('pages/login');
// signup page
exports.signup = (req, res) => res.render('pages/signup');


