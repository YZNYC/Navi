import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SIDEBAR_WIDTH = 270;
const PRIMARY_COLOR = '#EAB308';
const DARK_TEXT = '#1f2937';
const LIGHT_BACKGROUND = '#fefefe';

const MENU_ITEMS = [
  { title: 'Conta', icon: 'person-outline', screen: 'Conta' },
  { title: 'Histórico', icon: 'time-outline', screen: 'Historico' },
  { title: 'Ajustes', icon: 'settings-outline', screen: 'Ajustes' },
  { title: 'Ajuda', icon: 'help-circle-outline', screen: 'Ajuda' },
];

export default function CustomSidebar({ isSidebarOpen, animatedValue, onClose, onNavigate }) {
  return (
    <>
      <Animated.View style={[styles.sidebar, { transform: [{ translateX: animatedValue }] }]}>
        <SafeAreaView style={{ flex: 1 }}>
          <Text style={styles.sidebarTitle}>Menu</Text>

          {MENU_ITEMS.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              activeOpacity={0.6}
              onPress={() => onNavigate(item.screen)}
            >
              <Ionicons name={item.icon} size={22} color={PRIMARY_COLOR} style={styles.menuIcon} />
              <Text style={styles.menuText}>{item.title}</Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={styles.closeButton} activeOpacity={0.6} onPress={onClose}>
            <Ionicons name="close-circle-outline" size={22} color="#555" />
            <Text style={[styles.menuText, { marginLeft: 8 }]}>Fechar</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Animated.View>

      {isSidebarOpen && (
        <TouchableOpacity style={styles.overlay} onPress={onClose} activeOpacity={1} />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: SIDEBAR_WIDTH,
    backgroundColor: LIGHT_BACKGROUND,
    padding: 20,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 10,
    borderRightWidth: 1,
    borderRightColor: '#eee',
  },
  sidebarTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: PRIMARY_COLOR,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 10,
    marginBottom: 25,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 10,
    paddingHorizontal: 5,
  },
  menuIcon: { marginRight: 12 },
  menuText: {
    fontSize: 16,
    color: DARK_TEXT,
    fontWeight: '500',
  },
  closeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    marginTop: 'auto',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    zIndex: 999,
  },
});
