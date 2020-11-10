exports.show = (req, res) => {
	if (req.session.loggedin) {
		res.render("pages/admin");
	} else {
		res.redirect("/login");
	}
};

exports.statistics = async(req, res) => {
    if (req.session.loggedin) {
        // retrive total pets
        try {
            console.log(req.body);
            const client = await global.pool.connect();
            var month = req.body.month;
            var year = req.body.year;
            var GET_STATISTICS = `SELECT caretaker.cname AS ctname, caretaker.email AS ctemail, count(*) AS total, COUNT(DISTINCT caretaker_cares_at.at) AS petdays,
                                        calc_salary(caretaker.email, '${month}','${year}') AS salary
                                    FROM
                                        caretaker INNER JOIN caretaker_cares_at ON caretaker.email = caretaker_cares_at.ctemail
                                    WHERE EXTRACT(MONTH FROM caretaker_cares_at.at) = '${month}'
                                        AND EXTRACT(YEAR FROM caretaker_cares_at.at) = '${year}'
                                    GROUP BY caretaker.email
                                    ORDER BY total;`
            var result = (await client.query(GET_STATISTICS)).rows;
            console.log(result);
            res.render("pages/statistics", { title: "statistics", userData: result});
        } catch (err) {
            res.end();
            res.send('Please enter the month and year in the following format: MM YYYY');
        }
    } else {
        res.redirect("/login");     
    }

}

exports.statsct = async(req, res) => {
    if (req.session.loggedin) {
        try {
            console.log(req.body);
            const client = await global.pool.connect();
            var email = req.body.email;
            var GET_STATS_CT = `SELECT to_char(caretaker_cares_at.at, 'Mon') AS month, EXTRACT(year from caretaker_cares_at.at) AS year,
                                    COUNT(*) AS total_pets, COUNT(DISTINCT caretaker_cares_at.at) AS pet_days, 
                                    calc_salary('${email}',1,2) AS salary
                                FROM caretaker_cares_at
                                WHERE caretaker_cares_at.ctemail = '${email}'
                                GROUP BY 1,2;
                                `;
            var result = (await client.query(GET_STATS_CT)).rows;
            console.log(result);
            res.render("pages/statsct", { title: "statsct", userData: result});
        } catch (err) {
            res.end();
            res.send('Please enter a valid email');
        }
    } else {
        res.redirect("/login");
    }
};