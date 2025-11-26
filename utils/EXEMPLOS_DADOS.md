# 📊 Exemplos de Dados Gerados

## Estrutura de uma Transação de Ganho

```json
{
  "id": "abc123xyz",
  "tipo": "ganho",
  "titulo": "Salário",
  "valor": 3850.50,
  "data": "2024-07-05T14:23:45.678Z"
}
```

## Estrutura de uma Transação de Gasto

```json
{
  "id": "def456uvw",
  "tipo": "gasto",
  "titulo": "Supermercado Extra",
  "valor": 245.80,
  "categoria": "mercado",
  "data": "2024-07-12T18:45:12.345Z"
}
```

## Exemplo de Histórico de 1 Mês (Julho/2024)

### Ganhos (6 transações - Total: R$ 8.450,00)
| Data       | Título           | Valor       |
|------------|------------------|-------------|
| 05/07/2024 | Salário          | R$ 4.200,00 |
| 07/07/2024 | Salário          | R$ 3.500,00 |
| 15/07/2024 | Freelance        | R$ 850,00   |
| 20/07/2024 | Bônus            | R$ 600,00   |
| 22/07/2024 | Cashback         | R$ 45,00    |
| 28/07/2024 | Venda online     | R$ 255,00   |

### Gastos (18 transações - Total: R$ 3.280,50)

#### Comida (R$ 890,50)
| Data       | Título              | Valor     |
|------------|---------------------|-----------|
| 03/07/2024 | Supermercado Extra  | R$ 245,80 |
| 10/07/2024 | Feira livre         | R$ 85,00  |
| 14/07/2024 | Padaria             | R$ 45,70  |
| 18/07/2024 | Açougue             | R$ 180,00 |
| 25/07/2024 | Mercado São João    | R$ 334,00 |

#### Contas (R$ 520,00)
| Data       | Título            | Valor     |
|------------|-------------------|-----------|
| 08/07/2024 | Conta de luz      | R$ 185,00 |
| 12/07/2024 | Conta de água     | R$ 95,00  |
| 15/07/2024 | Conta de celular  | R$ 89,90  |
| 20/07/2024 | Internet          | R$ 150,10 |

#### Transporte (R$ 680,00)
| Data       | Título         | Valor     |
|------------|----------------|-----------|
| 02/07/2024 | Gasolina       | R$ 180,00 |
| 06/07/2024 | Uber           | R$ 45,50  |
| 11/07/2024 | Metrô          | R$ 85,00  |
| 16/07/2024 | 99             | R$ 38,00  |
| 23/07/2024 | Gasolina       | R$ 200,00 |
| 29/07/2024 | Estacionamento | R$ 25,00  |
| 30/07/2024 | Uber           | R$ 42,50  |

#### Outros (R$ 1.190,00)
| Data       | Título       | Valor     |
|------------|--------------|-----------|
| 01/07/2024 | Academia     | R$ 120,00 |
| 09/07/2024 | Farmácia     | R$ 85,50  |
| 13/07/2024 | Cinema       | R$ 65,00  |
| 19/07/2024 | Restaurante  | R$ 180,00 |
| 24/07/2024 | Streaming    | R$ 39,90  |
| 27/07/2024 | Roupas       | R$ 450,00 |
| 31/07/2024 | Delivery     | R$ 249,60 |

### Balanço do Mês
```
Total de Ganhos:  R$ 8.450,00
Total de Gastos:  R$ 3.280,50
─────────────────────────────────
Saldo Final:      R$ 5.169,50 ✅
```

## Distribuição por Categoria (5 meses)

```
┌─────────────────────────────────────────┐
│         Gastos por Categoria            │
├─────────────────────────────────────────┤
│ 🍔 Comida       32%  R$ 5.245,80       │
│ 🚗 Transporte   25%  R$ 4.100,00       │
│ 🎯 Outros       23%  R$ 3.770,00       │
│ 💡 Luz          10%  R$ 1.640,00       │
│ 💧 Água          6%  R$   985,00       │
│ 📱 Telefone      4%  R$   655,20       │
└─────────────────────────────────────────┘
```

## Timeline Visual (5 meses)

```
Jun/2024: ████████░░░░░░░░░░░░ 24 transações
Jul/2024: ███████████░░░░░░░░░ 28 transações
Ago/2024: ██████████░░░░░░░░░░ 26 transações
Set/2024: ████████████░░░░░░░░ 31 transações
Out/2024: ███████████░░░░░░░░░ 29 transações
```

## Estatísticas Gerais

```yaml
Total de Transações: 138
├── Ganhos: 28 (20%)
└── Gastos: 110 (80%)

Período: 01/06/2024 a 26/11/2024 (5 meses)

Valores:
├── Total de Ganhos:  R$ 42.250,00
├── Total de Gastos:  R$ 16.396,00
└── Saldo:            R$ 25.854,00 ✅

Média Mensal:
├── Ganhos:  R$ 8.450,00
├── Gastos:  R$ 3.279,20
└── Saldo:   R$ 5.170,80

Média por Transação:
├── Ganhos:  R$ 1.509,00
└── Gastos:  R$   149,05
```

## Visualização de Gráfico (Exemplo)

```
        Ganhos vs Gastos por Mês
    
9K  ┃     ███
    ┃     ███                    
8K  ┃     ███  ███  ███  ███  ███
    ┃     ███  ███  ███  ███  ███
7K  ┃     ███  ███  ███  ███  ███
    ┃ ▒▒▒ ███  ███  ███  ███  ███
6K  ┃ ▒▒▒ ███  ███  ███  ███  ███
    ┃ ▒▒▒ ███  ███  ███  ███  ███
5K  ┃ ▒▒▒ ███  ███  ███  ███  ███
    ┃ ▒▒▒ ███  ███  ███  ███  ███
4K  ┃ ▒▒▒ ███  ███  ███  ███  ███
    ┃ ▒▒▒ ███  ███  ███  ███  ███
3K  ┃ ▒▒▒ ███  ███  ███  ███  ███
    ┃ ▒▒▒ ███  ███  ███  ███  ███
2K  ┃ ▒▒▒ ███  ███  ███  ███  ███
    ┃ ▒▒▒ ███  ███  ███  ███  ███
1K  ┃ ▒▒▒ ███  ███  ███  ███  ███
    ┃ ▒▒▒ ███  ███  ███  ███  ███
0   ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━
      Jun  Jul  Ago  Set  Out
      
    ███ Ganhos    ▒▒▒ Gastos
```

## Como os Dados Ajudam no Desenvolvimento

### ✅ Testes de Gráficos
- Visualizar tendências ao longo do tempo
- Verificar distribuição por categorias
- Testar gráficos de pizza, barras e linhas

### ✅ Testes de Filtros
- Filtrar por categoria (mercado, transporte, etc)
- Filtrar por período (último mês, 3 meses, etc)
- Filtrar por tipo (ganhos vs gastos)

### ✅ Testes de Performance
- Renderização de listas grandes
- Scroll performance com muitos itens
- Velocidade de cálculos e agregações

### ✅ Testes de UI/UX
- Formatação de valores monetários
- Exibição de datas em português
- Layout com conteúdo real vs vazio

### ✅ Testes de Relatórios
- Geração de relatórios mensais
- Cálculo de médias e totais
- Exportação de dados
