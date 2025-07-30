import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './screens/HomeScreen.js';
import NovoRegistroScreen from './screens/NovoRegistroScreen.js';
import GanhoScreen from './screens/GanhoScreen.js';
import GastoScreen from './screens/GastoScreen.js';
import HistoricoScreen from './screens/HistoricoScreen.js';
import GraficoScreen from './screens/GraficoScreen.js';
import DASScreen from './screens/DASScreen.js';
import ConfiguracoesScreen from './screens/ConfiguracoesScreen.js';
import InicioScreen from './screens/InicioScreen.js';
import CriarContaScreen from './screens/CriarContaScreen.js';
import LoginScreen from './screens/LoginScreen.js';

const Stack = createNativeStackNavigator();

export default function App() {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    async function verificarLogin() {
      const manterConectado = await AsyncStorage.getItem('manterConectado');
      if (manterConectado === 'true') {
        setInitialRoute('Home');
      } else {
        setInitialRoute('Inicio');
      }
    }
    verificarLogin();
  }, []);

  if (!initialRoute) return null; // ou carregando...

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen name="Inicio" component={InicioScreen} options={{ headerShown: false }} />
        <Stack.Screen name="CriarConta" component={CriarContaScreen} options={{ title: 'Criar Conta' }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Tela Inicial' }} />
        <Stack.Screen name="NovoRegistro" component={NovoRegistroScreen} options={{ title: 'Novo Registro' }} />
        <Stack.Screen name="Ganho" component={GanhoScreen} options={{ title: 'Ganho' }} />
        <Stack.Screen name="Gasto" component={GastoScreen} options={{ title: 'Gasto' }} />
        <Stack.Screen name="Historico" component={HistoricoScreen} options={{ title: 'Histórico de Ganhos e Gastos' }} />
        <Stack.Screen name="Grafico" component={GraficoScreen} options={{ title: 'Gráfico Mensal' }} />
        <Stack.Screen name="DAS" component={DASScreen} options={{ title: 'Cálculo do DAS' }} />
        <Stack.Screen name="Configuracoes" component={ConfiguracoesScreen} options={{ title: 'Configurações do Aplicativo' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
