import { Alert } from 'react-native';
import { logoutUser } from '../dataBase/firebaseService';

/**
 * showLogoutConfirmation
 * Exibe um Alert de confirmação para logout com estilo padronizado
 * 
 * @param {Object} navigation - Objeto de navegação do React Navigation
 * @param {Function} onSuccess - Callback opcional executado após logout bem-sucedido
 * @param {Function} onError - Callback opcional executado em caso de erro
 */
export const showLogoutConfirmation = (navigation, onSuccess, onError) => {
  Alert.alert(
    'Confirmar Saída',
    'Você tem certeza que deseja sair da sua conta?',
    [
      {
        text: 'Cancelar',
        style: 'cancel',
        onPress: () => console.log('Logout cancelado')
      },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          try {
            const sucesso = await logoutUser();
            if (sucesso) {
              if (onSuccess) onSuccess();
              navigation.replace('Inicio');
            } else {
              if (onError) onError();
              Alert.alert('Erro', 'Não foi possível fazer logout. Tente novamente.');
            }
          } catch (error) {
            console.error('Erro ao fazer logout:', error);
            if (onError) onError();
            Alert.alert('Erro', 'Ocorreu um erro ao desconectar. Tente novamente.');
          }
        }
      }
    ],
    { cancelable: true }
  );
};
