
from fastapi import FastAPI
from pydantic import BaseModel
from gpt4all import GPT4All
import os

app = FastAPI()

# Caminho do modelo
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'models', 'mistral-7b-instruct-v0.1.Q5_0.gguf')
gpt4all_model = GPT4All(model_name=MODEL_PATH, model_type="mistral")

class FinanceData(BaseModel):
  ganhos: float
  gastos: float

@app.post("/dica")
async def get_dica(data: FinanceData):
  prompt = f"""
Você é um assistente financeiro especialista em MEI (Microempreendedor Individual). Analise os valores abaixo e gere UMA dica detalhada, prática, realista e específica para MEI, com foco em ações, estratégias ou ideias que realmente ajudem MEIs a economizar, investir ou equilibrar as finanças. Não dê sugestões genéricas, irrelevantes ou que não se apliquem a MEI. Não conte história, apenas a dica direta e útil.
Ganhos: R$ {data.ganhos:.2f}
Gastos: R$ {data.gastos:.2f}
Dica:
"""
  resposta = gpt4all_model.generate(prompt, max_tokens=40, temp=0.5)
  dica = resposta.strip().split('\n')[0]
  return {"dica": dica}
