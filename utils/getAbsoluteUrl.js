module.exports = function getAbsoluteUrl(req) {
    return req.protocol + '://' + req.get('host') + req.originalUrl;
}