/**
 * Script para popular o banco de dados com transações de teste
 * 
 * AVISO: Este script é apenas para desenvolvimento/testes!
 * 
 * Execute com: node scripts/popularBD.js
 */

// Este arquivo seria usado se quiséssemos popular via Node.js no terminal
// Mas como estamos usando Firebase Auth, é melhor fazer pelo app
console.log(`
╔══════════════════════════════════════════════════════════════╗
║              POPULAR BANCO DE DADOS - SIMPLIZA               ║
╚══════════════════════════════════════════════════════════════╝

📱 Para popular o banco de dados com dados de teste:

1. Execute o app no seu dispositivo/emulador
2. Faça login com sua conta
3. Vá em: Configurações
4. Clique em: "🛠️ Ferramentas de Dev"
5. Clique em: "Popular Dados"

✨ Isso adicionará automaticamente cerca de 100-150 transações
   distribuídas pelos últimos 5 meses!

📊 Tipos de dados que serão criados:
   • Salários mensais (2-3 por mês)
   • Ganhos variados (freelance, bônus, cashback, etc)
   • Gastos em todas as categorias (comida, luz, água, etc)
   • Datas aleatórias distribuídas ao longo dos meses

⚠️  NOTA: Use a ferramenta "Limpar Tudo" se quiser remover
   todos os dados e começar novamente.

`);
