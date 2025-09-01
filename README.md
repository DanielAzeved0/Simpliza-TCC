
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


### 3. Instalando dependências do backend IA
Abra o terminal na pasta `IA` e rode:
```sh
python -m venv .venv
.venv\Scripts\activate  # Windows
# ou
source .venv/bin/activate  # Linux/Mac
pip install -r requirements.txt
```

**Atenção:**
Se aparecer erro ao criar ou ativar o ambiente virtual (por exemplo, "Unable to create process" ou problemas com arquivos do `.venv`), delete a pasta `.venv` dentro de `IA` e repita os comandos acima.

### 4. Iniciando o backend IA
Ainda na pasta `IA` (com o ambiente virtual ativado):
```sh
uvicorn main:app --reload
```
O backend estará disponível em `http://localhost:8000/dica` (ou `http://10.0.2.2:8000/dica` para emulador Android).

### 5. Iniciando o app mobile
Abra outro terminal na pasta `simpliza` e rode:
```sh
npx expo start
```
- Para rodar no emulador Android: abra o emulador pelo Android Studio e selecione "Run on Android device/emulator" no Expo.
- Para rodar no dispositivo físico: escaneie o QR code com o app Expo Go.

### 6. Observações importantes
- O backend IA deve estar rodando para que as dicas apareçam no app.
- Se estiver usando emulador Android, a URL de acesso à IA deve ser `http://10.0.2.2:8000/dica`.
- Para personalizar dicas, edite o arquivo `IA/main.py`.

---

## 📂 Estrutura do Projeto
- `simpliza/` — App React Native (Expo)
- `IA/` — Backend Python (FastAPI) com modelo de IA para dicas financeiras

---

## 👨‍💻 Contato
Dúvidas ou sugestões? Entre em contato com o desenvolvedor.
