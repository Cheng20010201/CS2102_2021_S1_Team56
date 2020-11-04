exports.show = (req, res) => {
    if (req.session.loggedin) {
        res.render("pages/caretaker");
    } else {
        res.redirect("/login");
    }
};