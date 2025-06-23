import db from './db';

// Função para inserir transação
export const inserirTransacao = (tipo, titulo, valor, categoria) => {
  const data = new Date().toLocaleDateString();

  db.transaction((tx) => {
    tx.executeSql(
      'INSERT INTO transacoes (tipo, titulo, valor, categoria, data) VALUES (?, ?, ?, ?, ?);',
      [tipo, titulo, valor, categoria, data],
      (_, result) => console.log('Transação inserida', result),
      (_, error) => console.log('Erro ao inserir', error)
    );
  });
};

// Função para listar transações
export const listarTransacoes = (callback) => {
  db.transaction((tx) => {
    tx.executeSql(
      'SELECT * FROM transacoes ORDER BY id DESC;',
      [],
      (_, { rows }) => callback(rows._array),
      (_, error) => console.log('Erro ao buscar transações', error)
    );
  });
};
