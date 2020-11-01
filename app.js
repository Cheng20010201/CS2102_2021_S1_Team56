const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
var session = require('express-session');

const index = require('./routes/index');
const login = require('./routes/login');
const signup = require('./routes/signup');
const home = require('./routes/home');
const user = require('./routes/user');

var app = express();

const PORT = process.env.PORT || 5000;

const { Pool } = require('pg');
global.pool = new Pool({
	// remote
	
	connectionString: 'postgres://jwuwspufuqofov:d21784a76a425e1db7df92bee05c2226ac5cfe5143845e4189ab12d2bf4e6357@ec2-54-160-120-28.compute-1.amazonaws.com:5432/d6i27d3prsbgb7',
	ssl: {
		rejectUnauthorized: false
	}
	
	// local
	// connectionString: 'postgresql://api_user:password@localhost:5432/pet_demo',
	// ssl: false
});

// main logic
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser());
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.get('/', index.home);
// hello message demo
app.get('/hello', index.hello);
// about us
app.get('/people', index.aboutus);
// login page
app.get('/login', index.login);
// logout
app.get('/logout', index.logout);
// signup page
app.get('/signup', index.signup);
// show user profile, if logged in
app.get('/user', user.show);
// user login
app.post('/tryLogin', login.tryLogin);
// user signup
app.post('/trySignup', signup.trySignup);
// logged in
app.get('/home', home.show);
app.listen(PORT, () => console.log(`Listening on ${PORT}`));