// Considere usar variáveis de ambiente para sua chave de API para melhor segurança:
// const apiKey = process.env.GEMINI_API_KEY;
const apiKey = 'AIzaSyA1Gbn9wdkZX0K7nVfeNJWdOUbfA9-Zbhc'; // Substitua pela sua chave de API real ou use uma variável de ambiente
const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

/**
 * Analisa o histórico financeiro e gera um prompt para a IA.
 * @param {Array} historico - O array de transações (ganhos e gastos).
 * @returns {String} O prompt formatado para a API do Gemini.
 */
function criarPrompt(historico) {
  // Calcula os totais de ganhos e gastos
  const ganhos = historico.filter(i => i.tipo === 'ganho');
  const gastos = historico.filter(i => i.tipo === 'gasto');
  const soma = arr => arr.reduce((acc, cur) => acc + Number(cur.valor || 0), 0);

  const totalGanhos = soma(ganhos);
  const totalGastos = soma(gastos);
  const saldo = totalGanhos - totalGastos;

  // Agrupa os gastos por categoria
  const gastosPorCategoria = {};
  gastos.forEach(item => {
    gastosPorCategoria[item.categoria] = (gastosPorCategoria[item.categoria] || 0) + Number(item.valor || 0);
  });

  // Monta a string de categorias para o prompt
  let categoriasStr = Object.entries(gastosPorCategoria)
    .map(([cat, val]) => `- ${cat}: R$ ${val.toFixed(2)}`)
    .join('\n');

  if (!categoriasStr) {
    categoriasStr = "Nenhum gasto registrado neste período.";
  }

  // O prompt é a instrução que a IA receberá.
  // Ele define o papel da IA (consultor financeiro) e fornece os dados.
  const prompt = `
    Você é um consultor financeiro especialista e seu trabalho é analisar os dados financeiros de um usuário e fornecer dicas personalizadas, práticas e acionáveis.

    Analise o seguinte resumo financeiro:
    - Ganhos Totais: R$ ${totalGanhos.toFixed(2)}
    - Gastos Totais: R$ ${totalGastos.toFixed(2)}
    - Saldo (Ganhos - Gastos): R$ ${saldo.toFixed(2)}

    Distribuição de Gastos por Categoria:
    ${categoriasStr}

    Com base nesses dados, forneça de 3 a 5 dicas claras e objetivas para ajudar o usuário a economizar dinheiro, reduzir despesas desnecessárias e otimizar seus ganhos. Fale diretamente com o usuário (use "você"). Seja positivo e encorajador. Não inclua saudações ou despedidas, vá direto para as dicas em formato de lista com marcadores.
  `;

  return prompt;
}

/**
 * Envia os dados financeiros para a API do Gemini e retorna dicas.
 * @param {Array} historico - O array de transações do usuário.
 * @returns {Promise<String>} Uma string contendo as dicas financeiras geradas pela IA.
 */
export async function gerarDicasFinanceiras(historico) {
  // Verifica se a chave de API foi configurada
  if (apiKey === 'AIzaSyA1Gbn9wdkZX0K7nVfeNJWdOUbfA9-Zbhc' || !apiKey) {
    console.error("Erro: A chave da API do Google AI não foi configurada corretamente.");
    return "Erro: A chave da API do Google AI não foi configurada. Por favor, adicione sua chave ou verifique a configuração.";
  }

  // Se não houver histórico, retorna uma mensagem padrão.
  if (!historico || historico.length === 0) {
    return "Não há dados suficientes para gerar dicas. Comece registrando seus ganhos e gastos.";
  }

  const prompt = criarPrompt(historico);

  try {
    // Monta o corpo da requisição para a API do Gemini
    const body = JSON.stringify({
      contents: [{
        parts: [{
          text: prompt
        }]
      }]
    });

    // Faz a chamada para a API
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erro da API Gemini:", errorData);
      throw new Error(`Erro na API (${response.status}): ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();

    // Extrai o texto da resposta da IA
    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0]) {
      return data.candidates[0].content.parts[0].text;
    } else {
      console.error("Formato de resposta inesperado da API:", data);
      return "Não foi possível extrair as dicas da resposta da IA. O formato de resposta da API pode ter mudado ou está incompleto.";
    }

  } catch (error) {
    console.error("Erro ao chamar a API do Gemini:", error);
    return "Houve um problema ao conectar com a inteligência artificial. Verifique sua conexão ou tente novamente mais tarde.";
  }
}