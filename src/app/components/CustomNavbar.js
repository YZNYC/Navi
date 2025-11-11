import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PRIMARY_COLOR = '#EAB308';

export default function CustomNavbar({ toggleSidebar, title }) {
  return (
    <View style={styles.navbar}>
      <StatusBar barStyle="light-content" backgroundColor={PRIMARY_COLOR} />
      <TouchableOpacity onPress={toggleSidebar} style={styles.hamburger} activeOpacity={0.7}>
        <Ionicons name="menu" size={30} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.navbarTitle}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    height: 90,
    paddingTop: 40,
    backgroundColor: PRIMARY_COLOR,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  hamburger: { paddingRight: 15 },
  navbarTitle: {
    color: 'white',
    fontSize: 21,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
