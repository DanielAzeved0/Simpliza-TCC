// Categorias de gastos disponíveis no sistema
export const CATEGORIAS_GASTOS = [
  { label: 'Comida', value: 'mercado' },
  { label: 'Luz', value: 'luz' },
  { label: 'Água', value: 'agua' },
  { label: 'Telefone', value: 'telefone' },
  { label: 'Transporte', value: 'transporte' },
  { label: 'Outros', value: 'outros' },
];

// Mapeamento de categorias para exibição amigável
export const getCategoriaLabel = (value) => {
  const categoria = CATEGORIAS_GASTOS.find(cat => cat.value === value);
  return categoria ? categoria.label : value;
};

// Cores para os gráficos (expandido para suportar mais categorias)
export const CORES_GRAFICOS = [
  '#ff7675', // Vermelho suave
  '#74b9ff', // Azul suave
  '#ffeaa7', // Amarelo suave
  '#55efc4', // Verde água
  '#fd79a8', // Rosa
  '#a29bfe', // Roxo suave
  '#fab1a0', // Laranja suave
  '#ff9ff3', // Rosa claro
  '#48dbfb', // Azul claro
  '#1dd1a1', // Verde esmeralda
  '#feca57', // Amarelo mostarda
  '#ff6348', // Vermelho coral
  '#5f27cd', // Roxo escuro
  '#00d2d3', // Ciano
  '#c8d6e5', // Cinza azulado
  '#576574', // Cinza escuro
  '#ee5a6f', // Vermelho rosado
  '#0abde3', // Azul turquesa
  '#2e86de', // Azul royal
  '#dfe6e9', // Cinza claro
];
