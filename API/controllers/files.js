const path = require('path');

module.exports = {
    getFile(req, res) {
        res.sendFile(path.resolve('user_files','profile_pictures', req.params.filename));
    }
}