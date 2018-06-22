const mssql = require("mssql");
const dbConfig = {
    "server": "118.70.171.240",
    "database": "LH_GHIM",
    "user": "dev_teamthuctap",
    "password": "12054kdsg",
    "port": 25433
  };

module.exports = mssql.connect(dbConfig, function (err) {
    if (err)
        throw err;
    else {
        console.log("Đã chạy")
    }
});