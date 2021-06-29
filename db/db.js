const Pool = require("pg").Pool;

const pool = new Pool({
    user: "postgres",
    password: "4OIn2v!#",
    host: "localhost",
    port: 5432,
    database: "telly"
})

module.exports = pool;