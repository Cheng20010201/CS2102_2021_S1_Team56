const express = require('express');
const path = require('path');
// this is the port for the whole app, not db
const PORT = process.env.PORT || 5000; 

// prepare for pool connection
// using pool can facilitate multiple concurrent queries
const { Pool } = require('pg');
const pool = new Pool({	
	// For remote db connection:
    	/*connectionString: // the url in remote db credential doc
    	ssl: {
    		rejectUnauthorized: false
    	}*/
    // For local db connection:
    connectionString: 'postgresql://api_user:password@localhost:5432/pet_demo', // your local db url
    ssl: false
});

const HELLO = 'Hello, this is CS2102 group 56!'
const GET_COLLABORATORS = 'SELECT * FROM collaborators;';


// main logic
express()
	.use(express.static(path.join(__dirname, 'public')))
	.set('views', path.join(__dirname, 'views'))
	.set('view engine', 'ejs')
	// main UI
	.get('/', (req, res) => res.render('pages/index'))
	// hello message demo
	.get('/hello', (req, res) => res.send('Hello, this is CS2102 group 56! Hello, this is CS2102 group 56!'))
	// get all people, still UI demo
	.get('/people', async (req, res) => {
    		try {
      	  		const client = await pool.connect();
      	  		const result = await client.query(GET_COLLABORATORS);
      	    		const results = { 'results': (result) ? result.rows : null};
	    		res.render('pages/collaborators', results );
      	    		client.release();
    	  	} catch (err) {
      	    		console.error(err);
      	    		res.send("Error " + err);
    	  	}
  	})
	.listen(PORT, () => console.log(`Listening on ${ PORT }`));


