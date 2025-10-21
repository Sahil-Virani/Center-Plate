import React, { useEffect } from 'react';
import { View, StyleSheet, Modal as RNModal, Animated, TouchableWithoutFeedback } from 'react-native';
import { theme } from '../../styles/theme';

const Modal = ({
  visible,
  onClose,
  children,
  variant = 'default',
  style,
  contentStyle,
}) => {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(300)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 65,
          friction: 11,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 300,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: theme.colors.primary.main,
        };
      case 'secondary':
        return {
          backgroundColor: theme.colors.secondary.main,
        };
      default:
        return {
          backgroundColor: theme.colors.background.paper,
        };
    }
  };

  return (
    <RNModal
      visible={visible}
      transparent
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <Animated.View
            style={[
              styles.modalContent,
              getVariantStyles(),
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
              style,
            ]}
          >
            <TouchableWithoutFeedback>
              <View style={[styles.content, contentStyle]}>
                {children}
              </View>
            </TouchableWithoutFeedback>
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.lg,
  },
  content: {
    padding: theme.spacing.lg,
  },
});

export default Modal; 