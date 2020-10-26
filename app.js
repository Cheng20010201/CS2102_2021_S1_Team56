const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const index = require('./routes/index');
const login = require('./routes/login');
const signup = require('./routes/signup');
const home = require('./routes/home');
var app = express();

const PORT = process.env.PORT || 5000;

const { Pool } = require('pg');
global.pool = new Pool({
	// For remote db connection: url in remote db credential doc
	// connectionString: 'postgres://jwuwspufuqofov:d21784a76a425e1db7df92bee05c2226ac5cfe5143845e4189ab12d2bf4e6357@ec2-54-160-120-28.compute-1.amazonaws.com:5432/d6i27d3prsbgb7',
	// ssl: {
	// rejectUnauthorized: false
	// }
	// For local db connection: local db url
	connectionString: 'postgresql://api_user:password@localhost:5432/pet_demo',
	ssl: false
});

// main logic
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.get('/', index.home);
// hello message demo
app.get('/hello', index.hello);
// about us
app.get('/people', index.aboutus);
// login page
app.get('/login', index.login);
// signup page
app.get('/signup', index.signup);
// user login
app.post('/tryLogin', login.tryLogin);
// user signup
app.post('/trySignup', signup.trySignup);
// logged in
app.get('/home', home.show);
app.listen(PORT, () => console.log(`Listening on ${PORT}`));


