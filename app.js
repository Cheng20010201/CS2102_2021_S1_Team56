const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
var session = require('express-session');

const index = require('./routes/index');
const login = require('./routes/login');
const signup = require('./routes/signup');
const petOwner = require('./routes/petowner');
const careTaker = require('./routes/caretaker');
const admin = require('./routes/admin');
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
	// connectionString: 'postgresql://postgres:abc123456@localhost:5432/project',
	// ssl: false
});

// main logic
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
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
// pet owner/care taker signup
app.post('/trySignupPo', signup.trySignupPo);
app.post('/trySignupCt', signup.trySignupCt);
// choose user type to sign up
app.post('/signUpInit', signup.signUpInit);

// redirect after logged in
app.get('/petOwner', petOwner.show);
app.get('/careTaker', careTaker.show);
app.get('/admin', admin.show);

// functions for pet owners
app.get('/petOwner/profile', petOwner.profile);
app.post('/petOwner/saveProfile', petOwner.saveProfile);
app.get('/petOwner/history', petOwner.history);

app.listen(PORT, () => console.log(`Listening on ${PORT}`));