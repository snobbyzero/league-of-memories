const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
    console.log(req);
    const authHeader = req.headers.authorization;
    const jwtSecretKey = process.env.jwtSecretKey;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, jwtSecretKey, (err, user) => {
            console.log(token)
            if (err) {
                console.log(err);
                res.sendStatus(403);
            } else {
                req.user = user;
                next();
            }
        })
    } else {
        res.sendStatus(401);
    }
}
