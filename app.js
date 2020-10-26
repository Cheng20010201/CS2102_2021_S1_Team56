const express = require('express');
const path = require('path');
const routes = require('./routes');
var app = express();

// this is the port for the whole app, not db
const PORT = process.env.PORT || 5000; 

// prepare for pool connection
// using pool can facilitate multiple concurrent queries
const { Pool } = require('pg');
global.pool = new Pool({	
	// For remote db connection:
    	connectionString: 'postgres://jwuwspufuqofov:d21784a76a425e1db7df92bee05c2226ac5cfe5143845e4189ab12d2bf4e6357@ec2-54-160-120-28.compute-1.amazonaws.com:5432/d6i27d3prsbgb7',// the url in remote db credential doc
    	ssl: {
    		rejectUnauthorized: false
    	}
    // For local db connection:
    //connectionString: 'postgresql://postgres:abc123456@localhost:5432/project', // your local db url
    //ssl: false
});

// main logic
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.get('/', routes.home);
	// hello message demo
app.get('/hello', routes.hello);
	// about us
app.get('/people', routes.aboutus);
	// login page
app.get('/login', routes.login);
app.get('/signup', routes.signup);
app.listen(PORT, () => console.log(`Listening on ${ PORT }`));


