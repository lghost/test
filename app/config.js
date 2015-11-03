module.exports = {
  port: process.argv[2] || 4000,
  host: 'localhost',
  db: {
    dialect:  "mysql",
    host:     "localhost",
    database: "another_test_db",
    username: "test",
    password: "qwerty"
  }
}
