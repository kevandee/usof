const {connect} = require('../models/db')
const users = new (require('../models/user'))()
var fs = require('fs');

module.exports = async function checkDatabase() {
    try {
        await users.find(1);
    }
    catch(err) {
        console.log("Migrate up");
        let connection = connect();
        
        let sql = fs.readFileSync('./assets/migrations/migrate_up.sql')
        let scripts = sql.toString().replace(/\s+/g,' ').split(';');
        for (let script of scripts) {
            if (script){
                connection.query(script, function(err, sets, fields){
                    if(err) console.log(err);
                });
            }
        }
        connection.end();
        console.log("Migrations succeed");
    }
}