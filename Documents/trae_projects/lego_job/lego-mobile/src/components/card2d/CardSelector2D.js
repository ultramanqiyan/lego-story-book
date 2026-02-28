import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { COLORS } from '../../utils/constants';

const CardSelector2D = ({ title, items, selectedId, onPress }) => {
  const safeItems = Array.isArray(items) ? items : [];

  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {safeItems.map((item) => {
          const isSelected = selectedId === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.card,
                isSelected && styles.cardSelected,
              ]}
              onPress={() => onPress?.(item.id)}
              activeOpacity={0.8}
            >
              <Text style={styles.cardIcon}>{item.icon || '🎭'}</Text>
              <Text style={styles.cardName} numberOfLines={1}>
                {item.name || '选项'}
              </Text>
              {isSelected && (
                <View style={styles.selectedBadge}>
                  <Text style={styles.selectedText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  scrollContent: {
    paddingRight: 16,
    gap: 12,
  },
  card: {
    width: 80,
    height: 100,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    marginRight: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardSelected: {
    borderColor: COLORS.legoYellow,
    backgroundColor: COLORS.legoYellow + '20',
    shadowColor: COLORS.legoYellow,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    transform: [{ scale: 1.05 }],
  },
  cardIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  cardName: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
  },
  selectedBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.legoYellow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.text,
  },
});

export default CardSelector2D;
