const User = require('../users/users-model');

async function checkUsernameExists(req, res, next) {
    try {
        if (!req.body.username || !req.body.password) {
            return next({ status: 400, message: "username and password required"});
          }
        
        if (!req.body.username && !req.body.password) {
            return next({ status: 400, message: "username and password required"});
        }
        const [user] = await User.findBy({ username: req.body.username });
        if (!user) {
            next({ status: 401, message: 'invalid credentials'});
        } else {
            req.user = user;
            next();
        }
    } catch (err) {
        next(err);
    }
}

module.exports = { checkUsernameExists };