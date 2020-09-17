const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;

// postgre data base connection logic
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

express()
	.use(express.static(path.join(__dirname, 'public')))
	.set('views', path.join(__dirname, 'views'))
	.set('view engine', 'ejs')
	// .get('/', (req, res) => res.render('pages/index'))
	.get('/', (req, res) => res.send('Hello, this is CS2102 group 56!'))
	.get('/people', async (req, res) => {
    	  try {
      	    const client = await pool.connect();
	    // need to create the table using remote databse connection, 
	    // or an error will be thrown
      	    const result = await client.query('SELECT * FROM collaborators;');
      	    const results = { 'results': (result) ? result.rows : null};
      	    // render the result using pre-defined pages/db rendering
	    res.render('pages/db', results );
      	    client.release();
    	  } catch (err) {
      	    console.error(err);
      	    res.send("Error " + err);
    	  }
  	})
	.listen(PORT, () => console.log(`Listening on ${ PORT }`));
