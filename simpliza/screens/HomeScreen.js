import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Platform, BackHandler } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { AntDesign, Feather, FontAwesome5, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

export default function HomeScreen({ navigation }) {
  useFocusEffect(
    React.useCallback(() => {
      const backAction = () => true;
      const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
      return () => backHandler.remove();
    }, [])
  );
  const { width } = Dimensions.get('window');
  const CARD_MARGIN = 10;
  const CARD_SIZE = (width - 3 * CARD_MARGIN - 40) / 2; // 40 = paddingHorizontal*2
  const CARD_HEIGHT = CARD_SIZE; // Deixar os cards quadrados para alinhamento perfeito
  const ICON_SIZE = 32;
  return (
    <View style={styles.container}>

      {/* Botão grande (Acessar/Novo Registro) */}
  <View style={{width: CARD_SIZE * 2 + CARD_MARGIN, alignSelf: 'center', marginBottom: 12}}>
        <TouchableOpacity
          style={[styles.cardFull, { height: CARD_HEIGHT * 1.2, width: '100%' }]}
          onPress={() => navigation.navigate('NovoRegistro')}
        >
              <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <AntDesign name="pluscircleo" size={ICON_SIZE + 8} color="#065f46" />
                <Text style={[styles.cardText, { fontSize: 18, marginTop: 12 }]}>Novo Registro</Text>
              </View>
        </TouchableOpacity>
      </View>

      {/* Grid 2 colunas, 3 linhas */}
      <View style={styles.gridContainer}>
        <View style={styles.gridRow}>
          <TouchableOpacity
            style={[styles.card, { width: CARD_SIZE, height: CARD_HEIGHT, marginRight: CARD_MARGIN }]}
            onPress={() => navigation.navigate('Historico')}
          >
              <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <Feather name="clock" size={ICON_SIZE} color="#065f46" />
                <Text style={[styles.cardText, { fontSize: 16, marginTop: 8 }]}>Histórico</Text>
              </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.card, { width: CARD_SIZE, height: CARD_HEIGHT }]}
            onPress={() => navigation.navigate('Grafico')}
          >
              <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <FontAwesome5 name="chart-bar" size={ICON_SIZE} color="#065f46" />
                <Text style={[styles.cardText, { fontSize: 16, marginTop: 8 }]}>Gráficos</Text>
              </View>
          </TouchableOpacity>
        </View>
        <View style={styles.gridRow}>
          <TouchableOpacity
            style={[styles.card, { width: CARD_SIZE, height: CARD_HEIGHT, marginRight: CARD_MARGIN }]}
            onPress={() => navigation.navigate('DAS')}
          >
              <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <MaterialCommunityIcons name="calculator-variant" size={ICON_SIZE} color="#065f46" />
                <Text style={[styles.cardText, { fontSize: 16, marginTop: 8 }]}>Cálculo do DAS</Text>
              </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.card, { width: CARD_SIZE, height: CARD_HEIGHT }]}
            onPress={() => navigation.navigate('Configuracoes')}
          >
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
              <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <Feather name="settings" size={ICON_SIZE} color="#065f46" />
                <Text style={[styles.cardText, { fontSize: 16, marginTop: 8 }]}>Configurações</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      {/* Adicione mais linhas se quiser mais botões, seguindo o padrão acima */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6f4ea',
    paddingTop: 150,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  settingsButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    right: 20,
    zIndex: 1,
  },
  cardFull: {
    width: '100%',
    backgroundColor: '#ecfdf5',
    borderRadius: 16,
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginBottom: 18,
    paddingLeft: 24,
    paddingRight: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
  },
  gridContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridRow: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#ecfdf5',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
  },
  cardText: {
    marginTop: 12,
    color: '#065f46',
    fontWeight: 'bold',
    textAlign: 'center',
    flexWrap: 'wrap',
  },
});
