from fastapi import FastAPI
from pydantic import BaseModel
from sklearn.linear_model import LogisticRegression
import numpy as np

app = FastAPI()

# Base de treino expandida: [ganhos, gastos, saldo]
# saldo = ganhos - gastos
model = LogisticRegression(max_iter=1000)
X = np.array([
    [2000, 2500, -500],   # Gastos maiores que ganhos
    [3000, 2000, 1000],   # Ganhos maiores
    [1000, 1500, -500],   # Gastos maiores
    [4000, 1000, 3000],   # Ganhos muito maiores
    [1500, 1500, 0],      # Equilibrado
    [2500, 3000, -500],   # Gastos maiores
    [3500, 2000, 1500],   # Ganhos maiores
    [1200, 2000, -800],   # Gastos muito maiores
    [5000, 2000, 3000],   # Ganhos muito maiores
    [2000, 2000, 0],      # Equilibrado
    [1800, 2500, -700],   # Gastos maiores
    [3000, 3500, -500],   # Gastos maiores
    [4000, 4000, 0],      # Equilibrado
    [1000, 800, 200],     # Ganhos um pouco maiores
    [2500, 1000, 1500],   # Ganhos maiores
    [800, 2000, -1200],   # Gastos muito altos, ganhos baixos
    [6000, 1000, 5000],   # Ganhos muito altos
    [1200, 1200, 0],      # Equilibrado
    [900, 900, 0],        # Equilibrado, valores baixos
    [2000, 500, 1500],    # Ganhos muito maiores
    [1500, 2500, -1000],  # Gastos muito maiores
    [3000, 1000, 2000],   # Ganhos muito maiores
    [1000, 3000, -2000],  # Gastos muito altos
    [4000, 3500, 500],    # Ganhos um pouco maiores
    [2000, 1800, 200],    # Ganhos um pouco maiores
    [1000, 1000, 0],      # Equilibrado
    [500, 2000, -1500],   # Gastos muito altos, ganhos baixos
    [3500, 3500, 0],      # Equilibrado
    [2500, 500, 2000],    # Ganhos muito maiores
    [1200, 800, 400],     # Ganhos um pouco maiores
])
# 0 = dica para economizar, 1 = dica para investir/ganhar mais, 2 = dica para manter equilíbrio
y = [0, 1, 0, 1, 2, 0, 1, 0, 1, 2, 0, 0, 2, 2, 1, 0, 1, 2, 2, 1, 0, 1, 0, 1, 2, 2, 0, 2, 1, 2]
model.fit(X, y)

class FinanceData(BaseModel):
    ganhos: float
    gastos: float



import random
from fastapi import Request

# Variáveis globais para armazenar a última dica enviada por tipo
ultima_dica = {0: None, 1: None, 2: None}

@app.post("/dica")
async def get_dica(data: FinanceData, request: Request):
    saldo = data.ganhos - data.gastos
    pred = model.predict([[data.ganhos, data.gastos, saldo]])[0]
    dicas_economizar = [
        "Seus gastos estão altos em relação aos ganhos. Reveja despesas do seu MEI, corte custos desnecessários e negocie melhores condições com fornecedores.",
        "Evite misturar as contas pessoais com as do MEI. Separe os gastos e mantenha o controle do fluxo de caixa.",
        "Analise seus principais custos fixos e variáveis do negócio e veja onde é possível economizar.",
        "Busque alternativas mais baratas para insumos e serviços essenciais do seu MEI.",
        "Reduza despesas com deslocamento, energia e telefone, otimizando processos e uso de recursos.",
        "Renegocie dívidas do CNPJ para reduzir juros e melhorar o fluxo de caixa do seu negócio."
    ]
    dicas_investir = [
        "Você está com boa margem de ganhos! Considere reinvestir parte do lucro no seu MEI para crescer mais.",
        "Invista em divulgação digital, redes sociais ou melhorias no atendimento para atrair mais clientes.",
        "Busque capacitação e cursos para aprimorar sua gestão e expandir o negócio.",
        "Monte uma reserva financeira para o MEI, garantindo segurança em períodos de baixa demanda.",
        "Aproveite o bom momento para planejar novos produtos, serviços ou parcerias para o seu MEI."
    ]
    dicas_equilibrio = [
        "Seu MEI está equilibrado! Continue separando as finanças pessoais das empresariais e registre tudo.",
        "Parabéns pelo equilíbrio! Que tal revisar metas do negócio e buscar novas oportunidades de crescimento?",
        "Mantenha o hábito de registrar receitas e despesas do MEI para facilitar a gestão e evitar surpresas.",
        "Se possível, reserve um valor mensal do lucro para reinvestir ou poupar para o futuro do negócio.",
        "Continue atento a oportunidades de economia, investimento e inovação para o seu MEI."
    ]
    dicas_dict = {
        0: dicas_economizar,
        1: dicas_investir,
        2: dicas_equilibrio
    }
    dicas = dicas_dict[pred]
    dica_anterior = ultima_dica[pred]
    dicas_possiveis = [d for d in dicas if d != dica_anterior]
    if not dicas_possiveis:
        dica_escolhida = dicas[0]
    else:
        dica_escolhida = random.choice(dicas_possiveis)
    ultima_dica[pred] = dica_escolhida
    return {"dica": dica_escolhida}
