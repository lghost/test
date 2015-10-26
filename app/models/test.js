module.exports = function(db)
{
  return db.define('test', {
    value: String
  });
}
