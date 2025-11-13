import React from "react";
import { View, TextInput, Image, StyleSheet, SafeAreaView, ScrollView, Dimensions, TouchableOpacity, Text, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const parkingData = [
  {
    id: '1',
    name: 'Estacionamento Central Park',
    rating: 4.7,
    distance: '300m',
    tags: ['Coberto', 'Segurança 24h', 'Acessível'],
    availableSpots: 12,
    imageUrl: 'https://images.unsplash.com/photo-1543477134-8469c84918e5?fit=crop&w=600&q=80',
  },
  {
    id: '3',
    name: 'Vagas Premium Leste',
    rating: 4.2,
    distance: '850m',
    tags: ['VIP', 'Manobrista', 'Recarga Elétrica'],
    availableSpots: 2,
    imageUrl: 'https://images.unsplash.com/photo-1629853315891-b3b0d1e01865?fit=crop&w=600&q=80',
  },
];

const ParkingCard = ({ parking }) => (
  <View style={styles.card}>
    <Image source={{ uri: parking.imageUrl }} style={styles.cardImage} resizeMode="cover" />
    <View style={styles.cardContent}>
      <Text style={styles.cardTitle}>{parking.name}</Text>

      <View style={styles.ratingDistanceRow}>
        <Text style={styles.ratingText}>{'★ '}{parking.rating.toFixed(1)}</Text>
        <Text style={styles.dotSeparator}>•</Text>
        <Text style={styles.distanceText}>{parking.distance}</Text>
      </View>

      <View style={styles.tagsContainer}>
        {parking.tags.map((tag, index) => (
          <Text key={index} style={styles.tag}>{tag}</Text>
        ))}
      </View>

      <View style={styles.spotsRow}>
        <Ionicons name="car-outline" size={18} color="#6B7280" style={{ marginRight: 6 }} />
        <Text style={styles.spotsText}>
          <Text style={styles.spotsCount}>{parking.availableSpots}</Text> vagas disponíveis
        </Text>
      </View>

      <TouchableOpacity style={styles.reserveButton}>
        <Text style={styles.reserveButtonText}>Reservar Agora</Text>
      </TouchableOpacity>
    </View>
  </View>
);

export default function HomeScreen() {
  const carouselImages = [
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    "https://images.unsplash.com/photo-1526045478516-99145907023c",
    "https://images.unsplash.com/photo-1491553895911-0055eca6402d",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
  ];

  const filterTags = ["Mais barato", "Mais próximo", "Coberto", "Manobrista", "Elétrico"];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView contentContainerStyle={styles.container}>
        {/* Banner principal */}
        <Image source={{ uri: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c" }} style={styles.image} resizeMode="cover" />

        {/* Barra de pesquisa */}
        <TextInput style={styles.searchBar} placeholder="Pesquisar estacionamento..." placeholderTextColor="#999" />

        <TouchableOpacity style={styles.locationButton}>
          <Ionicons name="location-outline" size={18} color="#EAB308" style={{ marginRight: 8 }} />
          <Text style={styles.locationButtonText}>Usar minha localização</Text>
        </TouchableOpacity>

        {/* Filtros */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterContainer}>
          {filterTags.map((tag, index) => (
            <TouchableOpacity key={index} style={styles.filterTag}>
              <Text style={styles.filterTagText}>{tag}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Carrossel */}
        <View style={styles.carouselContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carousel}>
            {carouselImages.map((img, index) => (
              <Image key={index} source={{ uri: img }} style={styles.carouselImage} resizeMode="cover" />
            ))}
          </ScrollView>
        </View>

        {/* Recomendações */}
        <View style={styles.recommendationsContainer}>
          <Text style={styles.recommendationsTitle}>Estacionamentos Próximos</Text>
          {parkingData.map((parking) => (
            <ParkingCard key={parking.id} parking={parking} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F9FAFB" },
  container: { paddingBottom: 25 },
  image: {
    width: width * 0.9,
    height: 200,
    borderRadius: 18,
    marginVertical: 20,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 8,
  },
  searchBar: {
    width: width * 0.9,
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  locationButton: {
    flexDirection: "row",
    width: width * 0.9,
    marginTop: 15,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#EAB308",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    shadowColor: "#EAB308",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  locationButtonText: { color: "#EAB308", fontSize: 16, fontWeight: "700" },
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: width * 0.05,
    marginTop: 20,
    marginBottom: 15,
  },
  filterTag: {
    backgroundColor: "#FACC15",
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 9,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  filterTagText: { fontSize: 14, color: "#fff", fontWeight: "700" },
  carouselContainer: { width, marginTop: 10, marginBottom: 20 },
  carousel: { paddingLeft: width * 0.05 },
  carouselImage: {
    width: width * 0.75,
    height: 170,
    borderRadius: 18,
    marginRight: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  recommendationsContainer: { paddingHorizontal: width * 0.05 },
  recommendationsTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 18,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    marginBottom: 22,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 5,
    overflow: "hidden",
  },
  cardImage: { width: "100%", height: 160 },
  cardContent: { padding: 15 },
  cardTitle: { fontSize: 18, fontWeight: "700", color: "#1F2937", marginBottom: 5 },
  ratingDistanceRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  ratingText: { fontSize: 16, fontWeight: "700", color: "#EAB308" },
  dotSeparator: { marginHorizontal: 8, color: "#D1D5DB", fontSize: 14 },
  distanceText: { fontSize: 15, color: "#6B7280" },
  tagsContainer: { flexDirection: "row", flexWrap: "wrap", marginVertical: 10 },
  tag: {
    backgroundColor: "#FACC15",
    color: "#fff",
    fontSize: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 6,
    fontWeight: "600",
  },
  spotsRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  spotsText: { fontSize: 14, color: "#6B7280" },
  spotsCount: { fontSize: 17, fontWeight: "800", color: "#6B7280" },
  reserveButton: {
    backgroundColor: "#FACC15",
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#EAB308",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 6,
  },
  reserveButtonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
