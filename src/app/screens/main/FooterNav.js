import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

export default function FooterNav({ activeTab, setActiveTab }) {
  return (
    <View style={styles.footer}>
      <TouchableOpacity onPress={() => setActiveTab("home")}>
        <Text style={[styles.tab, activeTab === "home" && styles.active]}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setActiveTab("profile")}>
        <Text style={[styles.tab, activeTab === "profile" && styles.active]}>Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setActiveTab("settings")}>
        <Text style={[styles.tab, activeTab === "settings" && styles.active]}>Settings</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    position: "absolute",
    bottom: 25,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#EAB308",
    borderRadius: 30,
    paddingVertical: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10,
  },
  tab: {
    fontSize: 18,
    color: "#333",
  },
  active: {
    color: "#000",
    fontWeight: "bold",
  },
});
