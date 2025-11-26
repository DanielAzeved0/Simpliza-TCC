import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

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
import PrivacyScreen from './screens/PrivacyScreen.js';
import PopularDadosScreen from './screens/PopularDadosScreen.js';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Inicio" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Inicio" component={InicioScreen} />
        <Stack.Screen name="CriarConta" component={CriarContaScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="NovoRegistro" component={NovoRegistroScreen} />
        <Stack.Screen name="Ganho" component={GanhoScreen} />
        <Stack.Screen name="Gasto" component={GastoScreen} />
        <Stack.Screen name="Historico" component={HistoricoScreen} />
        <Stack.Screen name="Grafico" component={GraficoScreen} />
        <Stack.Screen name="DAS" component={DASScreen} />
        <Stack.Screen name="Configuracoes" component={ConfiguracoesScreen} />
        <Stack.Screen name="Privacy" component={PrivacyScreen} />
        <Stack.Screen name="PopularDados" component={PopularDadosScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
