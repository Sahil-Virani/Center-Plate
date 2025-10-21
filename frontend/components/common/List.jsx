import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import { theme } from '../../styles/theme';

const ListItem = ({
  children,
  onPress,
  disabled = false,
  style,
  contentStyle,
}) => {
  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.itemContainer,
        disabled && styles.itemDisabled,
        style,
      ]}
    >
      <View style={[styles.itemContent, contentStyle]}>
        {children}
      </View>
    </Container>
  );
};

const List = ({
  children,
  style,
  contentStyle,
  scrollable = true,
  showsVerticalScrollIndicator = true,
}) => {
  const Container = scrollable ? ScrollView : View;

  return (
    <Container
      style={[styles.container, style]}
      contentContainerStyle={[styles.content, contentStyle]}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
    >
      {children}
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.paper,
  },
  content: {
    paddingVertical: theme.spacing.xs,
  },
  itemContainer: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemDisabled: {
    opacity: 0.5,
  },
});

export { List, ListItem }; 