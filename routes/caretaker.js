exports.show = (req, res) => {
    if (req.session.loggedin) {
        res.render("pages/caretaker");
    } else {
        res.redirect("/login");
    }
};

exports.profile = async (req, res) => {
    if (req.session.loggedin) {
        // retrive user data
        try {
            const client = global.client;
            var GET_USER = `SELECT * FROM caretaker WHERE email='${req.session.email}'`;
            var result = (await client.query(GET_USER)).rows;
            var tempUser = result[0];
            // hack here to get the correct rating digits
            tempUser.rating = (tempUser.rating + '').substring(0, 3);
            var GET_PETDAY = `SELECT SUM(duration::INTEGER) FROM bids WHERE ctemail='${req.session.email}' AND success=TRUE;`;
            var pet_day = ((await client.query(GET_PETDAY)).rows)[0].sum;
            tempUser.petday = pet_day;
            res.render("pages/ct-profile", { user: tempUser });
        } catch (err) {
            console.log(err);
            res.end();
        }
    } else {
        res.redirect("/login");
    }
};


exports.saveProfile = async (req, res) => {
    if (req.session.loggedin) {
        try {
            // to update values
            var cname = req.body.userName;
            var area = req.body.userArea;
            var phonenum = req.body.userTel;
            if (phonenum.length !== 8) {
                res.send('Phone number can only be 8 digits long.');
            } else if (!(cname && area && phonenum)) {
                res.send('Name, area, phone number cannot be left blank.');
            } else {
                // be able to update
                const client = global.client;
                const UPDATE = `UPDATE caretaker SET cname='${cname}', area='${area}', phonenum='${phonenum}' WHERE email='${req.session.email}';`;
                await client.query(UPDATE);
                res.redirect('/caretaker');
            }
        } catch (err) {
            console.log(err);
            res.send('Update failure.');
        }
    } else {
        res.redirect("/login");
    }
    res.end();
}


exports.history = async (req, res) => {
    if (req.session.loggedin) {
        const client = global.client;
        const SELECT =
            `SELECT name, startdate, duration, poemail, price, rating, reviews FROM bids 
            WHERE ctemail='${req.session.email}' 
            AND success=TRUE;`;
        const result = (await client.query(SELECT)).rows;
        res.render("pages/ct-history", { title: "User List", userData: result });
    } else {
        res.redirect("/login");
    }
}

exports.salary = async (req, res) => {
    if (req.session.loggedin) {
        // retrive user data
        try {
            const client = global.client;
            const UPDATE = `SELECT amount, year, month FROM salary WHERE ctemail='${req.session.email}';`;
            const result = (await client.query(UPDATE)).rows;
            res.render("pages/ct-salary", { title: "User List", userData: result });
        } catch (err) {
            res.end();
        }
    } else {
        res.redirect("/login");
    }
};

exports.book = async (req, res) => {
    if (req.session.loggedin) {
        // retrive user data
        // retrive pending bidding data
        try {
            const client = global.client;
            const check_type = `
                SELECT timetype FROM caretaker WHERE email='${req.session.email}';
            `
            var result = ((await client.query(check_type)).rows)[0].timetype;
            if (result == 'full time') {
                res.send('this function is only available for part-time caretakers');
            } else {
                // part time
                // only select pending bids
                // not tested since currently no data for part time caretaker
                const select_pending = `
                    SELECT name, (SELECT type FROM pet WHERE poemail=bids.poemail AND name=bids.name) AS type, 
                    startdate, duration, poemail, price 
                    FROM bids WHERE ctemail='${req.session.email}' AND (success IS NULL);
                `;
                result = (await client.query(select_pending)).rows;
                res.render("pages/ct-book", { title: "User List", userData: result });
            }
        } catch (err) {
            console.log(err);
            res.end();
        }
    } else {
        res.redirect("/login");
    }
};

exports.accept = async (req, res) => {
    if (req.session.loggedin) {
        // mark bid as successful
        // same hack as in review for pet owner
        const client = global.client;
        var i = req.params.id - 1;
        const GET_BID = `
            SELECT name, startdate, enddate, poemail 
            FROM bids WHERE ctemail='${req.session.email}' AND (success IS NULL);
        `;
        const result = await client.query(GET_BID);
        var user = (result.rows)[i];

        var temp = { startdate: '', enddate: '' };
        temp.startdate = user.startdate;
        temp.enddate = user.enddate;

        user.startdate = temp.startdate.toISOString().substring(0, 10);
        user.enddate = temp.enddate.toISOString().substring(0, 10);
        const UPDATE_BID = `
            UPDATE bids SET success=TRUE WHERE 
            startdate=(date('${user.startdate}')+1)
            AND enddate=(date('${user.enddate}')+1)
            AND name='${user.name}'
            AND poemail='${user.poemail}'
            AND ctemail='${req.session.email}'
        `;
        client.query(UPDATE_BID);
        console.log("marked as successful");
        res.redirect('/caretaker');
    } else {
        res.redirect("/login");
    }
};

exports.reject = async (req, res) => {
    if (req.session.loggedin) {
        // mark bid as unsuccessful
        // same hack as in review for pet owner
        const client = global.client;
        var i = req.params.id - 1;
        const GET_BID = `
            SELECT name, startdate, enddate, poemail 
            FROM bids WHERE ctemail='${req.session.email}' AND (success IS NULL);
        `;
        const result = await client.query(GET_BID);
        var user = (result.rows)[i];

        var temp = { startdate: '', enddate: '' };
        temp.startdate = user.startdate;
        temp.enddate = user.enddate;

        user.startdate = temp.startdate.toISOString().substring(0, 10);
        user.enddate = temp.enddate.toISOString().substring(0, 10);
        const UPDATE_BID = `
            UPDATE bids SET success=FALSE WHERE 
            startdate=(date('${user.startdate}')+1)
            AND enddate=(date('${user.enddate}')+1)
            AND name='${user.name}'
            AND poemail='${user.poemail}'
            AND ctemail='${req.session.email}'
        `;
        client.query(UPDATE_BID);
        console.log("marked as unsuccessful");
        res.redirect('/caretaker');
    } else {
        res.redirect("/login");
    }
};

exports.monthly = async (req, res) => {
    if (req.session.loggedin) {
        try {

            const client = global.client;
            var GET_STATS_CT = `SELECT to_char(caretaker_cares_at.at, 'Mon') AS month, EXTRACT(year from caretaker_cares_at.at) AS year,
                                    COUNT(*) AS pet, COUNT(DISTINCT caretaker_cares_at.at) AS petday, 
                                    calc_salary('${req.session.email}',1,2) AS salary
                                FROM caretaker_cares_at
                                WHERE caretaker_cares_at.ctemail = '${req.session.email}'
                                GROUP BY 1,2;
                                `;
            var result = (await client.query(GET_STATS_CT)).rows;
            console.log(result);
            res.render("pages/ct-monthly", { userData: result });
        } catch (err) {
            console.log(err);
            res.send("Possible database error.");
        }
    } else {
        res.redirect("/login");
    }
}