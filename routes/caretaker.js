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
            const client = await global.pool.connect();
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
                const client = await global.pool.connect();
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
        const client = await global.pool.connect();
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
            const client = await global.pool.connect();
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
            const client = await global.pool.connect();
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

exports.accept = (req, res) => {
    if (req.session.loggedin) {
        // mark bid as successful
        // same hack as in review for pet owner
        console.log("marked as successful");
        res.redirect('/caretaker');
    } else {
        res.redirect("/login");
    }
};

exports.reject = (req, res) => {
    if (req.session.loggedin) {
        // mark bid as unsuccessful
        // same hack as in review for pet owner
        console.log("marked as unsuccessful");
        res.redirect('/caretaker');
    } else {
        res.redirect("/login");
    }
};

exports.monthly = async (req, res) => {
    if (req.session.loggedin) {
        try {

            const client = await global.pool.connect();
            var GET_MONTHLY = ``;// help me out
            /*var result = await client.query(GET_MONTHLY);
            var summary = result.rows;
            var summary = {
                year: ??,
                month: ???,
                care: 20,
                pet: 17,
                petday: 58,
                salary: 1920
            }*/
            res.render("pages/ct-monthly", { data: summary });
        } catch (err) {
            console.log(err);
            res.send("Possible database error.");
        }
    } else {
        res.redirect("/login");
    }
}