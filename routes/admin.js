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
            var GET_STATISTICS = `SELECT * FROM statistics('${month}','${year}')`;
            var result = (await client.query(GET_STATISTICS)).rows;
            console.log(result);
            res.render("pages/statistics", { title: "statistics", userData: result});
        } catch (err) {
            res.end();
        }
    } else {
        res.redirect("/login");
    }

}