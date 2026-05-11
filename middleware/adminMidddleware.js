module.exports = (req, res, next) => {
    // Check if the user is logged in and has the admin role
    if (req.session && req.session.user && req.session.user.role === 'admin') {
        return next();
    }   
    // If the user is not an admin, return a 403 Forbidden response
    res.status(403).send('Access denied. Admins only!');
};