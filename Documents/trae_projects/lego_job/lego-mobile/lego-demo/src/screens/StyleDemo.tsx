import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';

interface StyleDemoProps {
  onBack: () => void;
}

const StyleDemo: React.FC<StyleDemoProps> = ({ onBack }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← 返回</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>🎨 风格设置</Text>
        <View style={styles.placeholder} />
      </View>
      
      <View style={styles.content}>
        <Text style={styles.emptyText}>风格设置页面</Text>
        <Text style={styles.emptySubtext}>敬请期待...</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF5E6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#8B4513',
    borderBottomWidth: 2,
    borderBottomColor: '#654321',
  },
  backButton: {
    padding: 5,
  },
  backButtonText: {
    color: '#FFF8DC',
    fontSize: 16,
  },
  headerTitle: {
    color: '#FFF8DC',
    fontSize: 20,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 60,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#5D3A1A',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#8B7355',
  },
});

export default StyleDemo;
