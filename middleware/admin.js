module.exports = (req, res, next) => {
    console.log(req.user);
    if (req.user.isAdmin) {
        next();
    } else {
        res.status(403).send("Access denied");
    }
};