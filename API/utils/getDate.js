module.exports = function getDate() {
    let date = new Date()
    //const offset = date.getTimezoneOffset()
    //date = new Date(date.getTime() - (offset*60*1000))
    return date.getTime();
}
