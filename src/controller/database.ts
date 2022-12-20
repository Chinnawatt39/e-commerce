import config from "../config/config.json";

const mysql = require('mysql2');
const pool = mysql.createPool({
  connectionLimit: 1,
  host: config.db.host,
  port: config.db.port,
  user: config.db.user,
  password: config.db.password,
  database: config.db.dbname,
  waitForConnections: true,
});

const conn = pool.promise();

export default conn;
