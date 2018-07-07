const mssql = require("mssql");
const dbConfigLocal = {
    "server": "10.100.1.125",
    "database": "LH_GHIM",
    "user": "dev_teamthuctap",
    "password": "12054kdsg",
    "port": 1433
};
const dbConfigOpen = {
    "server": "118.70.171.240",
    "database": "LH_GHIM",
    "user": "dev_teamthuctap",
    "password": "12054kdsg",
    "port": 25433
};

module.exports = mssql.connect(dbConfigOpen, function (err) {
    if (err)
        throw err;
    else {
        console.log("Đã chạy")
    }
});