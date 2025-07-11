const db = require('../config/db');

const createUser = async (user) => {
  const { name, email, password, address, role } = user;
  const result = await db.query(
    'INSERT INTO users (name, email, password, address, role) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [name, email, password, address, role]
  );
  return result.rows[0];
};

const getUserByEmail = async (email) => {
  const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
};

module.exports = {
  createUser,
  getUserByEmail,
};
