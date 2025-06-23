import db from './db';

export const createTables = () => {
  db.transaction((tx) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS transacoes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tipo TEXT,
        titulo TEXT,
        valor REAL,
        categoria TEXT,
        data TEXT
      );`
    );
  });
};
