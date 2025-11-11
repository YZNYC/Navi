import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated } from "react-native";

export default function PaginationSwitch() {
  const [index, setIndex] = useState(0);
  const contents = [
    "🍕 Conteúdo 1: Pizza maravilhosa!",
    "🍔 Conteúdo 2: Hambúrguer suculento!",
    "🍣 Conteúdo 3: Sushi fresquinho!",
    "🍰 Conteúdo 4: Sobremesa deliciosa!"
  ];

  // Animação suave na troca de conteúdo
  const fadeAnim = new Animated.Value(1);

  const changeContent = (i) => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 150, useNativeDriver: true })
    ]).start(() => setIndex(i));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Barra de Paginação</Text>

      {/* Barra de botões */}
      <View style={styles.pagination}>
        {contents.map((_, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.button, index === i && styles.activeButton]}
            onPress={() => changeContent(i)}
          >
            <Text style={[styles.buttonText, index === i && styles.activeText]}>
              {i + 1}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Conteúdo com animação */}
      <Animated.View style={[styles.contentBox, { opacity: fadeAnim }]}>
        <Text style={styles.contentText}>{contents[index]}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF9E6",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#EAB308",
    marginBottom: 20,
  },
  pagination: {
    flexDirection: "row",
    marginBottom: 30,
    gap: 10,
  },
  button: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
  },
  activeButton: {
    backgroundColor: "#EAB308",
    elevation: 5,
  },
  buttonText: {
    fontSize: 16,
    color: "#555",
  },
  activeText: {
    color: "white",
    fontWeight: "bold",
  },
  contentBox: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
    width: "100%",
    elevation: 3,
  },
  contentText: {
    fontSize: 18,
    color: "#333",
    textAlign: "center",
  },
});
