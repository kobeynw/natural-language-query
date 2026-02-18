import mysql from 'mysql2/promise';
import config from '../config.js';

let _connection = null;

async function getConnection() {
  if (_connection) return _connection;

  _connection = await mysql.createConnection(config.dbConnectionString);
  return _connection;
}

export async function runQuery(sql) {
  const connection = await getConnection();
  const [rows] = await connection.execute(sql);
  return rows;
}