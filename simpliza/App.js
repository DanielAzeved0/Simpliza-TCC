import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen  from './screens/HomeScreen.js';
import  NovoRegistroScreen  from './screens/NovoRegistroScreen.js';
import  GanhoScreen  from './screens/GanhoScreen.js';
import  GastoScreen  from './screens/GastoScreen.js';
import  HistoricoScreen  from './screens/HistoricoScreen.js';
import  GraficoScreen  from './screens/GraficoScreen.js';
import  InteligenciaScreen  from './screens/InteligenciaScreen.js';
import  DASScreen  from './screens/DASScreen.js';
import  ConfiguracoesScreen  from './screens/ConfiguracoesScreen.js';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Tela Inicial' }} />
        <Stack.Screen name="NovoRegistro" component={NovoRegistroScreen} options={{ title: 'Novo Registro' }} />
        <Stack.Screen name="Ganho" component={GanhoScreen} options={{ title: 'Ganho' }} />
        <Stack.Screen name="Gasto" component={GastoScreen} options={{ title: 'Gasto' }} />
        <Stack.Screen name="Historico" component={HistoricoScreen} options={{ title: 'Historico de Ganhos e Gastos' }} />
        <Stack.Screen name="Grafico" component={GraficoScreen} options={{ title: 'Grafico Mensal' }} />
        <Stack.Screen name="Inteligencia" component={InteligenciaScreen} options={{ title: 'IA de Auxilio' }} />
        <Stack.Screen name="DAS" component={DASScreen} options={{ title: 'Calculo do DAS' }} />
        <Stack.Screen name="Configuracoes" component={ConfiguracoesScreen} options={{ title: 'Configurações do Aplicativo' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
