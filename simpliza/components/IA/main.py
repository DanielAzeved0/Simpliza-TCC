from fastapi import FastAPI
from pydantic import BaseModel
from sklearn.linear_model import LogisticRegression
import numpy as np

app = FastAPI()

# Exemplo de modelo treinado (substitua por um modelo real depois)
model = LogisticRegression()
X = np.array([[2000, 2500], [3000, 2000], [1000, 1500], [4000, 1000]])
y = [0, 1, 0, 1]  # 0 = dica para economizar, 1 = dica para investir/ganhar mais
model.fit(X, y)

class FinanceData(BaseModel):
    ganhos: float
    gastos: float

@app.post("/dica")
def get_dica(data: FinanceData):
    pred = model.predict([[data.ganhos, data.gastos]])[0]
    if pred == 0:
        return {"dica": "Tente reduzir seus gastos para equilibrar suas finanças."}
    else:
        return {"dica": "Considere investir ou buscar novas fontes de renda para aumentar seus ganhos."}
