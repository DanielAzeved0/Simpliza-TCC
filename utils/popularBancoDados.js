import { adicionarTransacao } from '../dataBase/firebaseService';
import { CATEGORIAS_GASTOS } from './constants';

// Dados de exemplo para títulos de ganhos
const TITULOS_GANHOS = [
  'Salário',
  'Freelance',
  'Bônus',
  'Cashback',
  'Venda online',
  'Rendimento',
  'Presente',
  'Reembolso',
  'Extra',
  'Comissão'
];

// Dados de exemplo para títulos de gastos por categoria
const TITULOS_GASTOS = {
  mercado: ['Supermercado Extra', 'Feira livre', 'Açougue', 'Padaria', 'Mercado São João', 'Hortifruti', 'Atacadão'],
  luz: ['Conta de luz', 'Energia elétrica', 'Light'],
  agua: ['Conta de água', 'Saneamento', 'Sabesp'],
  telefone: ['Conta de celular', 'Internet', 'Vivo', 'Tim', 'Claro', 'NET'],
  transporte: ['Uber', 'Gasolina', 'Ônibus', 'Metrô', '99', 'Estacionamento', 'Pedágio'],
  outros: ['Farmácia', 'Academia', 'Streaming', 'Lazer', 'Roupas', 'Restaurante', 'Cinema', 'Delivery']
};

// Função para gerar uma data aleatória dentro de um intervalo
function gerarDataAleatoria(inicio, fim) {
  const inicioTimestamp = inicio.getTime();
  const fimTimestamp = fim.getTime();
  const aleatorio = Math.random() * (fimTimestamp - inicioTimestamp) + inicioTimestamp;
  return new Date(aleatorio);
}

// Função para gerar valor aleatório dentro de um range
function gerarValorAleatorio(min, max) {
  return (Math.random() * (max - min) + min).toFixed(2);
}

// Função para gerar um título aleatório de um array
function pegarTituloAleatorio(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// Função para gerar transações de ganho
function gerarGanho(data) {
  const titulo = pegarTituloAleatorio(TITULOS_GANHOS);
  let valor;
  
  // Valores variados dependendo do tipo de ganho
  if (titulo === 'Salário') {
    valor = gerarValorAleatorio(2500, 5000);
  } else if (titulo === 'Freelance') {
    valor = gerarValorAleatorio(500, 2000);
  } else if (titulo === 'Bônus') {
    valor = gerarValorAleatorio(300, 1500);
  } else {
    valor = gerarValorAleatorio(50, 500);
  }

  return {
    tipo: 'ganho',
    titulo,
    valor: parseFloat(valor),
    data: data.toISOString()
  };
}

// Função para gerar transações de gasto
function gerarGasto(data) {
  const categoriaObj = CATEGORIAS_GASTOS[Math.floor(Math.random() * CATEGORIAS_GASTOS.length)];
  const categoria = categoriaObj.value;
  const titulosPossiveis = TITULOS_GASTOS[categoria];
  const titulo = pegarTituloAleatorio(titulosPossiveis);
  
  let valor;
  
  // Valores variados dependendo da categoria
  switch (categoria) {
    case 'mercado':
      valor = gerarValorAleatorio(50, 400);
      break;
    case 'luz':
      valor = gerarValorAleatorio(100, 300);
      break;
    case 'agua':
      valor = gerarValorAleatorio(50, 150);
      break;
    case 'telefone':
      valor = gerarValorAleatorio(50, 200);
      break;
    case 'transporte':
      valor = gerarValorAleatorio(20, 200);
      break;
    case 'outros':
      valor = gerarValorAleatorio(30, 300);
      break;
    default:
      valor = gerarValorAleatorio(20, 200);
  }

  return {
    tipo: 'gasto',
    titulo,
    valor: parseFloat(valor),
    categoria,
    data: data.toISOString()
  };
}

// Função principal para popular o banco de dados
export async function popularBancoDados() {
  try {
    console.log('Iniciando população do banco de dados...');
    
    const hoje = new Date();
    const cincoMesesAtras = new Date();
    cincoMesesAtras.setMonth(hoje.getMonth() - 5);
    
    const transacoes = [];
    
    // Gerar transações para cada mês
    for (let mes = 0; mes < 5; mes++) {
      const dataInicio = new Date(cincoMesesAtras);
      dataInicio.setMonth(cincoMesesAtras.getMonth() + mes);
      
      const dataFim = new Date(dataInicio);
      dataFim.setMonth(dataInicio.getMonth() + 1);
      dataFim.setDate(0); // Último dia do mês
      
      // Gerar 2-3 salários por mês (no dia 5 ou próximo)
      const qtdSalarios = Math.random() > 0.5 ? 2 : 3;
      for (let i = 0; i < qtdSalarios; i++) {
        const diaSalario = new Date(dataInicio);
        diaSalario.setDate(5 + Math.floor(Math.random() * 3)); // Entre dia 5 e 7
        if (diaSalario <= hoje) {
          transacoes.push(gerarGanho(diaSalario));
        }
      }
      
      // Gerar 3-5 outros ganhos por mês
      const qtdGanhos = Math.floor(Math.random() * 3) + 3;
      for (let i = 0; i < qtdGanhos; i++) {
        const dataGanho = gerarDataAleatoria(dataInicio, dataFim > hoje ? hoje : dataFim);
        if (dataGanho <= hoje) {
          transacoes.push(gerarGanho(dataGanho));
        }
      }
      
      // Gerar 15-25 gastos por mês
      const qtdGastos = Math.floor(Math.random() * 11) + 15;
      for (let i = 0; i < qtdGastos; i++) {
        const dataGasto = gerarDataAleatoria(dataInicio, dataFim > hoje ? hoje : dataFim);
        if (dataGasto <= hoje) {
          transacoes.push(gerarGasto(dataGasto));
        }
      }
    }
    
    // Ordenar transações por data
    transacoes.sort((a, b) => new Date(a.data) - new Date(b.data));
    
    console.log(`Total de transações geradas: ${transacoes.length}`);
    
    // Adicionar transações ao Firestore com delay para evitar sobrecarga
    let sucessos = 0;
    let erros = 0;
    
    for (let i = 0; i < transacoes.length; i++) {
      try {
        // Usar a data gerada ao invés de deixar o adicionarTransacao criar uma nova
        const transacao = transacoes[i];
        const resultado = await adicionarTransacao(transacao);
        
        if (resultado) {
          sucessos++;
          if ((i + 1) % 10 === 0) {
            console.log(`Progresso: ${i + 1}/${transacoes.length} transações adicionadas`);
          }
        } else {
          erros++;
        }
        
        // Pequeno delay para não sobrecarregar o Firebase
        if (i % 5 === 0) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      } catch (error) {
        console.error(`Erro ao adicionar transação ${i}:`, error);
        erros++;
      }
    }
    
    console.log(`\n✓ População concluída!`);
    console.log(`  - Sucessos: ${sucessos}`);
    console.log(`  - Erros: ${erros}`);
    console.log(`  - Total: ${transacoes.length}`);
    
    return { sucessos, erros, total: transacoes.length };
  } catch (error) {
    console.error('Erro ao popular banco de dados:', error);
    throw error;
  }
}

// Função para limpar todas as transações (útil para testes)
export async function limparTransacoes() {
  const { getHistorico, deleteTransacao } = require('../dataBase/firebaseService');
  
  try {
    console.log('Limpando transações...');
    const transacoes = await getHistorico();
    
    for (let i = 0; i < transacoes.length; i++) {
      await deleteTransacao(transacoes[i].id);
      if ((i + 1) % 10 === 0) {
        console.log(`Deletadas: ${i + 1}/${transacoes.length}`);
      }
    }
    
    console.log(`✓ ${transacoes.length} transações deletadas com sucesso!`);
    return transacoes.length;
  } catch (error) {
    console.error('Erro ao limpar transações:', error);
    throw error;
  }
}
