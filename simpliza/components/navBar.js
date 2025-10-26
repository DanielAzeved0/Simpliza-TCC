import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

/**
 * NavBar
 * Componente de barra de navegação inferior usado no app.
 * Recebe uma prop:
 *  - onPress: função callback que será chamada com uma string identificadora
 *             indicando qual botão foi pressionado.
 *
 * Estrutura:
 *  - 5 botões: Início, Histórico, NovoRegistro (central), Gráficos, DAS
 *  - Botão central é destacado visualmente (maior e "flutuante")
 */
const NavBar = ({ onPress }) => {
  return (
    // Container principal que organiza os itens em linha (horizontal)
    <View style={styles.container}>
      {/* INÍCIO
          - TouchableOpacity captura o toque do usuário
          - Ao pressionar chama onPress('Inicio') se o callback existir
          - Ícone + rótulo abaixo */}
      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => onPress && onPress('Inicio')}
        accessibilityLabel="Botão Início"
      >
        <Ionicons name="home-outline" size={32} color="#065f46" />
        <Text style={styles.label}>Início</Text>
      </TouchableOpacity>

      {/* HISTÓRICO
          - Abre a tela de registros/histórico */}
      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => onPress && onPress('Historico')}
        accessibilityLabel="Botão Histórico"
      >
        <MaterialCommunityIcons name="file-document-edit-outline" size={30} color="#065f46" />
        <Text style={styles.label}>Histórico</Text>
      </TouchableOpacity>

      {/* BOTÃO CENTRAL: NOVO REGISTRO
          - Destaque visual (maior, com top negativo para "saltar" acima da barra)
          - Geralmente usado para ação principal (criar novo registro) */}
      <TouchableOpacity
        style={styles.centralButton}
        onPress={() => onPress && onPress('NovoRegistro')}
        accessibilityLabel="Botão Novo Registro"
      >
        <Ionicons name="add-circle-outline" size={60} color="#065f46" />
      </TouchableOpacity>

      {/* GRÁFICOS
          - Acessa a tela de estatísticas/relatórios */}
      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => onPress && onPress('Graficos')}
        accessibilityLabel="Botão Gráficos"
      >
        <Ionicons name="stats-chart-outline" size={28} color="#065f46" />
        <Text style={styles.label}>Gráficos</Text>
      </TouchableOpacity>

      {/* CÁLCULO DO DAS
          - Ação para abrir calculadora/funcionalidade relacionada ao DAS */}
      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => onPress && onPress('DAS')}
        accessibilityLabel="Botão Cálculo DAS"
      >
        <MaterialCommunityIcons name="file-document-edit-outline" size={30} color="#065f46" />
        <Text style={styles.label}>Cálculo DAS</Text>
      </TouchableOpacity>
    </View>
  );
};

/**
 * styles
 * Estilos organizados por bloco e comentados para facilitar manutenção.
 */
const styles = StyleSheet.create({
  // Container principal da NavBar:
  // - flexDirection row => itens em linha
  // - justifyContent space-between => distribui espaço entre os botões
  // - alignItems center => centraliza verticalmente
  // - padding e borda superior para separação visual
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff', // fundo branco para contraste com ícones
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderTopWidth: 2,
    borderColor: '#d1fae5', // borda sutil na parte superior
    elevation: 0, // sombra para Android
    shadowColor: '#000', // sombras para iOS
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    marginBottom: 5, // cria espaço abaixo da barra para evitar sobreposição
  },

  // Estilo dos botões laterais (Início, Histórico, Gráficos, DAS)
  // - flex: 1 para que os quatro ocupem espaço igual
  // - alignItems center para alinhar ícone e texto ao centro
  iconButton: {
    alignItems: 'center',
    flex: 1,
    paddingVertical: 2,
  },

  // Estilo do botão central (Novo Registro)
  // - top: -18 desloca o botão para cima, criando efeito "flutuante"
  // - borderRadius e backgroundColor para aparência circular
  // - elevation/shadow adicionam profundidade
  centralButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 2,
    top: -18,
    backgroundColor: '#fff',
    borderRadius: 32,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },

  // Texto dos rótulos abaixo dos ícones
  // - fontSize diminuto para caber sem poluir a barra
  // - cor alinhada com paleta e negrito para legibilidade
  label: {
    fontSize: 12,
    color: '#065f46',
    marginTop: 2,
    fontWeight: 'bold',
  },
});

export default NavBar;