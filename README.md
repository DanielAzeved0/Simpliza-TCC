
# 📱 Simpliza

**Simpliza** é um aplicativo mobile desenvolvido em React Native, criado para auxiliar **MEIs e pequenos empreendedores** no controle das suas finanças mensais. Ele permite registrar ganhos e gastos e visualizar gráficos financeiros.

---

## 🚀 Funcionalidades

- Cadastro de ganhos e gastos
- Histórico financeiro mensal
- Gráficos comparativos de receitas e despesas
- Cálculo simplificado do DAS
- Tela de configurações com informações do app

---

## 🛠️ Como rodar o projeto (Desenvolvedor)

### 1. Pré-requisitos
- Node.js e npm instalados
- Android Studio (para emulador) ou dispositivo Android/iOS

### 2. Instalando dependências do app
Abra o terminal na pasta `simpliza` e rode:
```sh
npm install
```

### 3. Iniciando o app mobile
Abra o terminal na pasta `simpliza` e rode:
```sh
npx expo start
```
- Para rodar no emulador Android: abra o emulador pelo Android Studio e selecione "Run on Android device/emulator" no Expo.
- Para rodar no dispositivo físico: escaneie o QR code com o app Expo Go.

### 4. Criação de apk
Ao dar o comandano `npm install`,  rode o comando:
```sh
npm install -g eas-cli
```
Após rodar esse comando a ferramenta **EAS CLI** que é essencial para interagir com os serviços **EAS** (Expo Application Services), usados no desenvolvimento de aplicativos com o **Expo**
```sh
eas --version
```
Se aparecer a versão da sua **EAS**, está tudo dentro dos conformes, se não, refaça o processo.

Logo após diite o seguinte comando no seu terminal:
```sh
eas build -p android --profile preview
```
A principal função deste comando é criar um APK ou AAB do seu aplicativo Android que você pode instalar diretamente em um dispositivo físico (celular/tablet), sem a necessidade de um servidor de desenvolvimento rodando no seu computador.

- Para baixar o APK leia o QR Code e baixe o aplicativo em seu celular/tablet.

### 5. Mande atualições para a produção
Para configurar atualizações, execute o seguinte comando :
```sh
eas update:configure
```
Esse comando manda as atulições para os arquivos baixados, tanto os baixado pela a **EAS Build**, tanto os arquivos baixados por alguma loja online (Como a PlayStore, App Store, etc), após a conclusão do comando, você precisará fazer novas compilações antes de continuar para a próxima seção. 

Para enviar uma atualização, execute o seguinte comando EAS CLI :
```sh
eas update --channel production
```
Este comando criará uma atualização e a disponibilizará para compilações do seu aplicativo configuradas para receber atualizações no productioncanal. Este canal é definido em eas.json .

Você pode verificar se a atualização funciona forçando o fechamento do aplicativo e abrindo-o novamente duas vezes. A atualização deverá ser aplicada na segunda inicialização.

### 6. Observações importantes. Em seguida certifique-se q a **EAS** foi baixada usando o comando:
- Certifique-se de que todas as dependências estejam instaladas antes de rodar o app.

## 📂 Estrutura do Projeto
- `simpliza/` — App React Native (Expo)

## 👨‍💻 Contato
Dúvidas ou sugestões? Entre em contato com o desenvolvedor.
