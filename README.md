
# 📱 Simpliza

**Simpliza** é um aplicativo mobile desenvolvido em React Native, criado para auxiliar **MEIs e pequenos empreendedores** no controle das suas finanças mensais. Ele permite registrar ganhos e gastos, visualizar gráficos financeiros e receber dicas inteligentes de gestão e economia geradas por uma IA personalizada.

---

## 🚀 Funcionalidades

- Cadastro de ganhos e gastos
- Histórico financeiro mensal
- Gráficos comparativos de receitas e despesas
- Cálculo simplificado do DAS
- Dicas inteligentes e personalizadas para MEI (via IA)
- Botão para atualizar dica da IA
- Tela de configurações com informações do app

---

## 🛠️ Como rodar o projeto (Desenvolvedor)

### 1. Pré-requisitos
- Node.js e npm instalados
- Python 3.8+ instalado
- Android Studio (para emulador) ou dispositivo Android/iOS

### 2. Instalando dependências do app
Abra o terminal na pasta `simpliza` e rode:
```sh
npm install
```



### 3. Instalando dependências do backend IA (com IA generativa local)
Abra o terminal na pasta `IA` e rode:
```sh
python -m venv .venv
.venv\Scripts\activate  # Windows
# ou
source .venv/bin/activate  # Linux/Mac
pip install -r requirements.txt
pip install gpt4all
```

### 4. Baixando e configurando o modelo de IA generativa
1. Baixe um modelo open source compatível, por exemplo: `mistral-7b-instruct-v0.1.Q5_0.gguf` (pelo app GPT4All Desktop ou site oficial).
2. Copie o arquivo do modelo (.gguf ou .bin) para a pasta `IA/models`.
	- Exemplo de caminho: `c:/Users/SeuUsuario/Desktop/Simpliza-TCC/IA/models/mpt-7b-8k-chat.Q2_K.gguf`

### 5. Iniciando o backend IA
Ainda na pasta `IA` (com o ambiente virtual ativado):
```sh
uvicorn main:app --reload
```
O backend estará disponível em `http://localhost:8000/dica` (ou `http://10.0.2.2:8000/dica` para emulador Android).

### 6. Iniciando o app mobile
Abra outro terminal na pasta `simpliza` e rode:
```sh
npx expo start
```
- Para rodar no emulador Android: abra o emulador pelo Android Studio e selecione "Run on Android device/emulator" no Expo.
- Para rodar no dispositivo físico: escaneie o QR code com o app Expo Go.

### 7. Observações importantes
- O backend IA deve estar rodando para que as dicas apareçam no app.
- Se estiver usando emulador Android, a URL de acesso à IA deve ser `http://10.0.2.2:8000/dica`.
- O modelo de IA generativa pode demorar para responder na primeira execução.
- Para personalizar o prompt das dicas, edite o arquivo `IA/main.py`.

---

## 📂 Estrutura do Projeto
- `simpliza/` — App React Native (Expo)
- `IA/` — Backend Python (FastAPI) com modelo de IA para dicas financeiras

---

## 👨‍💻 Contato
Dúvidas ou sugestões? Entre em contato com o desenvolvedor.
