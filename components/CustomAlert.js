import React from 'react';
import { Modal, View, Text, Pressable, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * CustomAlert
 * Modal customizado moderno e bonito para substituir Alert.alert
 * 
 * @param {boolean} visible - Controla visibilidade do modal
 * @param {string} type - Tipo do alert: 'success', 'error', 'warning', 'info'
 * @param {string} title - Título do alert
 * @param {string} message - Mensagem do alert
 * @param {Function} onClose - Callback ao fechar (usado quando twoButtons=false)
 * @param {string} buttonText - Texto do botão (padrão: 'OK')
 * @param {object} customColors - Cores customizadas { color, bgColor, iconColor }
 * @param {boolean} twoButtons - Se true, mostra dois botões (Cancelar/Confirmar)
 * @param {Function} onConfirm - Callback ao confirmar (usado quando twoButtons=true)
 * @param {Function} onCancel - Callback ao cancelar (usado quando twoButtons=true)
 * @param {string} confirmText - Texto do botão de confirmar (padrão: 'Confirmar')
 * @param {string} cancelText - Texto do botão de cancelar (padrão: 'Cancelar')
 */
const CustomAlert = ({ 
  visible, 
  type = 'info', 
  title, 
  message, 
  onClose,
  buttonText = 'OK',
  customColors,
  twoButtons = false,
  onConfirm,
  onCancel,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar'
}) => {
  const scaleAnim = React.useRef(new Animated.Value(0)).current;
  const opacityAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      // Reset values
      scaleAnim.setValue(0.9);
      opacityAnim.setValue(0);
      
      // Animate together
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 100,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        })
      ]).start();
    } else {
      scaleAnim.setValue(0.9);
      opacityAnim.setValue(0);
    }
  }, [visible, scaleAnim, opacityAnim]);

  const getIconAndColor = () => {
    // Se customColors foi fornecido, usa as cores customizadas
    if (customColors) {
      return {
        icon: type === 'success' ? 'checkmark-circle' : 
              type === 'error' ? 'close-circle' : 
              type === 'warning' ? 'warning' : 'information-circle',
        ...customColors
      };
    }

    switch (type) {
      case 'success':
        return { 
          icon: 'checkmark-circle', 
          color: '#10b981', 
          bgColor: '#d1fae5',
          iconColor: '#059669'
        };
      case 'error':
        return { 
          icon: 'close-circle', 
          color: '#ef4444', 
          bgColor: '#fee2e2',
          iconColor: '#dc2626'
        };
      case 'warning':
        return { 
          icon: 'warning', 
          color: '#f59e0b', 
          bgColor: '#fef3c7',
          iconColor: '#d97706'
        };
      default:
        return { 
          icon: 'information-circle', 
          color: '#3b82f6', 
          bgColor: '#dbeafe',
          iconColor: '#2563eb'
        };
    }
  };

  const { icon, color, bgColor, iconColor } = getIconAndColor();

  const handleClose = () => {
    if (twoButtons && onCancel) {
      onCancel();
    } else if (onClose) {
      onClose();
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    } else if (onClose) {
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <Pressable style={styles.overlay} onPress={handleClose}>
        <Animated.View 
          style={[
            styles.alertContainer,
            { 
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim
            }
          ]}
          onStartShouldSetResponder={() => true}
        >
          {/* Ícone */}
          <View style={[styles.iconContainer, { backgroundColor: bgColor }]}>
            <Ionicons name={icon} size={48} color={iconColor} />
          </View>

          {/* Título */}
          <Text style={styles.title}>{title}</Text>

          {/* Mensagem */}
          <Text style={styles.message}>{message}</Text>

          {/* Botões */}
          {twoButtons ? (
            <View style={styles.buttonContainer}>
              <Pressable
                style={[styles.button, styles.cancelButton]}
                onPress={handleClose}
                android_ripple={{ color: 'rgba(0,0,0,0.1)' }}
              >
                <Text style={styles.cancelButtonText}>{cancelText}</Text>
              </Pressable>

              <Pressable
                style={[styles.button, styles.confirmButton, { backgroundColor: color }]}
                onPress={handleConfirm}
                android_ripple={{ color: 'rgba(255,255,255,0.3)' }}
              >
                <Text style={styles.buttonText}>{confirmText}</Text>
              </Pressable>
            </View>
          ) : (
            <Pressable
              style={[styles.button, styles.singleButton, { backgroundColor: color }]}
              onPress={handleClose}
              android_ripple={{ color: 'rgba(255,255,255,0.3)' }}
            >
              <Text style={styles.buttonText}>{buttonText}</Text>
            </Pressable>
          )}
        </Animated.View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  alertContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  singleButton: {
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  confirmButton: {
    flex: 1,
  },
  cancelButtonText: {
    color: '#4b5563',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});

export default CustomAlert;
