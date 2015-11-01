module.exports = {
  port: process.argv[2] || 3000,
  host: 'localhost',
  db: {
    dialect:  "mysql",
    host:     "localhost",
    database: "test_db",
    username: "test",
    password: "qwerty"
  }
}
