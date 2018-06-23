const mssql = require("mssql");
const dbConfig = {
    "server": "10.100.1.125",
    "database": "LH_GHIM",
    "user": "dev_teamthuctap",
    "password": "12054kdsg",
    "port": 1433
};

module.exports = mssql.connect(dbConfig, function (err) {
    if (err)
        throw err;
    else {
        console.log("Đã chạy")
    }
});