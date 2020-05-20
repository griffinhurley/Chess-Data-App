const { Pool } = require('pg')

const pool = new Pool({
  user: 'me',
  host: 'localhost',
  database: 'chessdata',
  password: 'password',
  port: 5432
})

module.exports = pool