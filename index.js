const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;

// postgre data base connection logic
const { Pool } = require('pg');
const pool = new Pool({
	// the commented out part is for local testing
    	// connectionString: process.env.DATABASE_URL || 'postgresql://api_user:password@localhost:5432/pet_demo',
    	// ssl: process.env.DATABASE_URL ? true : false;
	connectionString: process.env.DATABASE_URL,
 	ssl: {
    		rejectUnauthorized: false
  	}
})

// main logic
express()
	.use(express.static(path.join(__dirname, 'public')))
	.set('views', path.join(__dirname, 'views'))
	.set('view engine', 'ejs')
	// get index page
	.get('/', (req, res) => res.render('pages/index'))
	// get hello message
	.get('/hello', (req, res) => res.send('Hello, this is CS2102 group 56! Hello, this is CS2102 group 56!'))
	// get all people
	.get('/people', async (req, res) => {
    		try {
			// connection is remote
      	  		const client = await pool.connect();
      	  		const result = await client.query('SELECT * FROM collaborators;');
      	    		const results = { 'results': (result) ? result.rows : null};
	    		res.render('pages/db', results );
      	    		client.release();
    	  	} catch (err) {
      	    		console.error(err);
      	    		res.send("Error " + err);
    	  	}
  	})
	.listen(PORT, () => console.log(`Listening on ${ PORT }`));
