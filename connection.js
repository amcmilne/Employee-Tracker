var mysql = require("mysql");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "webapi",
    password: "password123",
    database: "employeetracker_db"
});
connection.connect(function (err) {
    if (err) throw err
    //console.log("connected as Id" + connection.threadId)

});

module.exports = connection;