exports.show = (req, res) => {
    if (req.session.loggedin) {
        res.send(req.session.email);
    } else {
        res.send('Please login');
        res.redirect('/login');
    }
    res.end();
};