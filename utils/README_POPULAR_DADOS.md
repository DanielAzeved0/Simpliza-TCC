# 🛠️ Ferramentas de Popular Banco de Dados

## 📋 Visão Geral

Este conjunto de ferramentas permite popular automaticamente o banco de dados do Simpliza com dados de teste realistas, facilitando o desenvolvimento e testes da aplicação.

## 🚀 Como Usar

### Método 1: Pelo App (Recomendado)

1. **Execute o aplicativo** em modo de desenvolvimento
2. **Faça login** com sua conta
3. **Acesse Configurações** (ícone de engrenagem na barra inferior)
4. **Clique em "🛠️ Ferramentas de Dev"** (aparece apenas em modo desenvolvimento)
5. **Escolha uma opção:**
   - **Popular Dados**: Adiciona ~100-150 transações dos últimos 5 meses
   - **Limpar Tudo**: Remove TODAS as transações (use com cuidado!)

### Método 2: Via Terminal (Informativo)

```bash
node scripts/popularBD.js
```

Este script apenas exibe instruções, pois a população requer autenticação Firebase.

## 📊 Dados Gerados

### Ganhos (5-7 por mês)
- **Salários**: R$ 2.500 - R$ 5.000 (dias 5-7 do mês)
- **Freelance**: R$ 500 - R$ 2.000
- **Bônus**: R$ 300 - R$ 1.500
- **Outros**: Cashback, vendas online, reembolsos, etc (R$ 50 - R$ 500)

### Gastos (15-25 por mês)
- **Comida**: R$ 50 - R$ 400 (supermercado, feira, padaria)
- **Luz**: R$ 100 - R$ 300
- **Água**: R$ 50 - R$ 150
- **Telefone**: R$ 50 - R$ 200 (celular, internet)
- **Transporte**: R$ 20 - R$ 200 (Uber, gasolina, ônibus)
- **Outros**: R$ 30 - R$ 300 (farmácia, academia, lazer)

## 📁 Estrutura dos Arquivos

```
utils/
  └── popularBancoDados.js      # Lógica principal de geração de dados

screens/
  └── PopularDadosScreen.js     # Interface da ferramenta no app

scripts/
  └── popularBD.js              # Script informativo para terminal
```

## 🔧 Funções Principais

### `popularBancoDados()`
Gera e adiciona transações aleatórias ao banco de dados do usuário logado.

**Retorna:**
```javascript
{
  sucessos: 145,  // Transações adicionadas
  erros: 0,       // Erros durante adição
  total: 145      // Total de transações geradas
}
```

### `limparTransacoes()`
Remove todas as transações do usuário logado.

**Retorna:**
```javascript
150  // Número de transações deletadas
```

## ⚡ Características

- ✅ **Dados Realistas**: Valores e títulos variados por categoria
- ✅ **Distribuição Temporal**: 5 meses de histórico
- ✅ **Salários Periódicos**: Ganhos regulares no início do mês
- ✅ **Gastos Variados**: Mix de despesas fixas e variáveis
- ✅ **Datas Aleatórias**: Distribuição natural ao longo dos dias
- ✅ **Feedback Visual**: Progresso e resultados detalhados
- ✅ **Modo Seguro**: Confirmações antes de ações destrutivas

## 🎯 Casos de Uso

### Teste de Gráficos
Popular o banco para visualizar gráficos com dados reais:
```
Configurações → Ferramentas de Dev → Popular Dados
```

### Teste de Filtros
Criar histórico variado para testar filtros por categoria/período.

### Teste de Performance
Verificar comportamento do app com volume maior de dados.

### Reset do Ambiente
Limpar todos os dados e começar novamente:
```
Configurações → Ferramentas de Dev → Limpar Tudo
```

## ⚠️ Avisos Importantes

1. **Apenas Desenvolvimento**: A tela "Ferramentas de Dev" só aparece quando `__DEV__` é `true`
2. **Requer Login**: É necessário estar autenticado para usar as ferramentas
3. **Operação Irreversível**: "Limpar Tudo" deleta permanentemente os dados
4. **Demora**: Popular ~150 transações pode levar 30-60 segundos
5. **Limite Firebase**: Respeita os limites de escrita do Firestore

## 🔍 Exemplo de Saída

```
Iniciando população do banco de dados...
Total de transações geradas: 142
Progresso: 10/142 transações adicionadas
Progresso: 20/142 transações adicionadas
...
Progresso: 140/142 transações adicionadas

✓ População concluída!
  - Sucessos: 142
  - Erros: 0
  - Total: 142
```

## 🐛 Troubleshooting

### Erro: "Você precisa estar logado"
**Solução**: Faça login antes de usar as ferramentas

### Erro: "Não foi possível adicionar transação"
**Solução**: Verifique sua conexão com internet e permissões do Firebase

### Ferramenta não aparece
**Solução**: Certifique-se de estar em modo desenvolvimento (`npm start`)

## 📝 Notas Técnicas

- As datas são geradas usando `Date.toISOString()` para compatibilidade
- Os valores são armazenados como `Number` (float)
- Pequenos delays evitam sobrecarga do Firebase (100ms a cada 5 transações)
- A função `adicionarTransacao` foi modificada para aceitar datas customizadas

## 🤝 Contribuindo

Para adicionar novos tipos de transações ou categorias:

1. Edite os arrays em `utils/popularBancoDados.js`:
   - `TITULOS_GANHOS`
   - `TITULOS_GASTOS`

2. Ajuste os ranges de valores nas funções:
   - `gerarGanho()`
   - `gerarGasto()`

## 📄 Licença

Este recurso faz parte do projeto Simpliza - TCC 2025
