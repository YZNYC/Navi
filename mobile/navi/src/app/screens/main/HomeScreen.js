import React, { useState } from "react";
import {
  View,
  TextInput,
  Image,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Text,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLogin } from "../../../providers/loginProvider"; 

const parkingData = [
  {
    id: "1",
    name: "Estacionamento Central Park",
    rating: 4.7,
    distance: "300m",
    price: "R$ 6/h",
    tags: ["Coberto", "Segurança 24h"],
    availableSpots: 12,
    imageUrl: "https://images.unsplash.com/photo-1543477134-8469c84918e5?fit=crop&w=600&q=80"
  },
  {
    id: "3",
    name: "Vagas Premium Leste",
    rating: 4.2,
    distance: "850m",
    price: "R$ 10/h",
    tags: ["VIP", "Recarga Elétrica"],
    availableSpots: 2,
    imageUrl: "https://images.unsplash.com/photo-1629853315891-b3b0d1e01865?fit=crop&w=600&q=80"
  },
  {
    id: "4",
    name: "Shopping Park Sul",
    rating: 4.9,
    distance: "1.2km",
    price: "R$ 5/h",
    tags: ["Aberto", "Auto-serviço"],
    availableSpots: 35,
    imageUrl: "https://images.unsplash.com/photo-1583091176008-01121f153282?fit=crop&w=600&q=80"
  }
];

const quickActions = [
  { title: "Coberto", icon: "shield-outline", filter: 'coberto' },
  { title: "Mais Barato", icon: "pricetag-outline", filter: 'maisBarato' },
  { title: "Mais Próximo", icon: "navigate-outline", filter: 'maisProximo' },
  { title: "Aberto Agora", icon: "time-outline", filter: 'abertoAgora' },
];

// COMPONENTE DE FILTRO (AGORA SELECIONÁVEL)
const QuickAction = ({ icon, title, selected, onPress }) => (
  <TouchableOpacity
    style={[styles.quickActionButton, selected && styles.quickActionButtonSelected]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={[styles.quickActionIconContainer, selected && styles.quickActionIconSelected]}>
      <Ionicons name={icon} size={26} color={selected ? "#fff" : "#1F2937"} />
    </View>
    <Text style={[styles.quickActionText, selected && styles.quickActionTextSelected]}>
      {title}
    </Text>
  </TouchableOpacity>
);

const ParkingCard = ({ parking }) => (
  <View style={styles.card}>
    <Image source={{ uri: parking.imageUrl }} style={styles.cardImage} resizeMode="cover" />

    <View style={styles.cardContent}>
      <View style={styles.cardHeaderRow}>
        <Text style={styles.cardTitle}>{parking.name}</Text>
        <Text style={styles.priceText}>{parking.price}</Text>
      </View>

      <View style={styles.ratingDistanceRow}>
        <View style={styles.ratingBox}>
          <Ionicons name="star" size={14} color="#fff" />
          <Text style={styles.ratingText}>{parking.rating.toFixed(1)}</Text>
        </View>

        <Text style={styles.dotSeparator}>•</Text>
        <Ionicons name="navigate-circle-outline" size={16} color="#6B7280" style={{ marginRight: 4 }} />
        <Text style={styles.distanceText}>{parking.distance}</Text>
      </View>

      <View style={styles.tagsContainer}>
        {parking.tags.map((tag, index) => (
          <Text key={index} style={styles.tag}>{tag}</Text>
        ))}
      </View>

      <View style={styles.footerRow}>
        <Text style={styles.spotsText}>
          <Text style={styles.spotsCount}>{parking.availableSpots}</Text> vagas disponíveis
        </Text>

        <TouchableOpacity style={styles.reserveButton} activeOpacity={0.8}>
          <Text style={styles.reserveButtonText}>Reservar</Text>
          <Ionicons name="arrow-forward" size={16} color="#fff" style={{ marginLeft: 6 }} />
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

// MAPA FAKE
const MapPlaceholder = () => (
  <View style={styles.mapContainer}>
    <Image
      source={{ uri: "https://images.unsplash.com/photo-1596765796791-030f8f877684?fit=crop&w=1200&q=80" }}
      style={styles.mapImage}
      resizeMode="cover"
    />
  </View>
);

export default function HomeScreen() {
  const { user } = useLogin();
  const userName = user?.nome || "Usuário";

  // ESTADOS PARA FILTROS
  const [selectedFilters, setSelectedFilters] = useState([]);

  const toggleFilter = (filter) => {
    if (selectedFilters.includes(filter)) {
      setSelectedFilters(selectedFilters.filter((f) => f !== filter));
    } else {
      setSelectedFilters([...selectedFilters, filter]);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      <MapPlaceholder />

      <ScrollView contentContainerStyle={styles.scrollContent}>

        <View style={styles.topContentOverlay}>

          <View style={styles.header}>
            <View>
              <Text style={styles.greetingTitle}>Olá, {userName}</Text>
              <Text style={styles.greetingSubtitle}>Pronto para estacionar?</Text>
            </View>
            <TouchableOpacity style={styles.profileButton}>
              <Ionicons name="notifications-outline" size={24} color="#1F2937" />
            </TouchableOpacity>
          </View>

          {/* 🔎 BARRA DE PESQUISA */}
          <View style={styles.searchSection}>
            <View style={styles.searchBarContainer}>
              <Ionicons name="search" size={20} color="#9CA3AF" style={{ marginRight: 10 }} />
              <TextInput
                style={styles.searchBarInput}
                placeholder="Pesquisar estacionamento por endereço..."
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <TouchableOpacity style={styles.locationButton} activeOpacity={0.8}>
              <Ionicons name="locate-outline" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* ⭐ FILTROS ATUALIZADOS */}
          <View style={styles.quickActionsContainer}>
            {quickActions.map((action, index) => (
              <QuickAction
                key={index}
                icon={action.icon}
                title={action.title}
                selected={selectedFilters.includes(action.filter)}
                onPress={() => toggleFilter(action.filter)}
              />
            ))}
          </View>

        </View>

        {/* BANNERS */}
        <Text style={styles.sectionTitle}>Ofertas e Promoções</Text>
        <View style={styles.carouselContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            contentContainerStyle={styles.carousel}
          >
            <Image
              source={{ uri: "https://images.unsplash.com/photo-1506744038136-46273834b3fb" }}
              style={styles.carouselImage}
            />
            <Image
              source={{ uri: "https://images.unsplash.com/photo-1526045478516-99145907023c" }}
              style={styles.carouselImage}
            />
            <Image
              source={{ uri: "https://images.unsplash.com/photo-1491553895911-0055eca6402d" }}
              style={styles.carouselImage}
            />
          </ScrollView>
        </View>

        {/* RECOMENDADOS */}
        <View style={styles.recommendationsContainer}>
          <Text style={styles.sectionTitle}>Recomendados na Região</Text>

          {parkingData.map((parking) => (
            <ParkingCard key={parking.id} parking={parking} />
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const { width } = Dimensions.get("window");
const PADDING = width * 0.05;
const PRIMARY_COLOR = "#EAB308";
const TEXT_COLOR = "#1F2937";

const styles = StyleSheet.create({
  safeArea: { flex: 1 },

  mapContainer: { ...StyleSheet.absoluteFillObject, zIndex: 0 },
  mapImage: { flex: 1, opacity: 0.8 },

  scrollContent: { paddingBottom: 40, zIndex: 1 },

  topContentOverlay: {
    backgroundColor: "rgba(255,255,255,0.95)",
    paddingBottom: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: PADDING,
    paddingVertical: 15,
  },
  greetingTitle: { fontSize: 24, fontWeight: "800", color: TEXT_COLOR },
  greetingSubtitle: { fontSize: 14, color: "#6B7280", marginTop: 2 },

  profileButton: {
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  searchSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: PADDING,
    marginBottom: 20,
  },
  searchBarContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    elevation: 2,
  },
  searchBarInput: { flex: 1, fontSize: 16, color: TEXT_COLOR },
  locationButton: {
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 14,
    padding: 13,
    elevation: 5,
  },

  /** ⭐ FILTROS / QUICKACTIONS */
  quickActionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: PADDING,
    marginTop: 10,
  },
  quickActionButton: {
    alignItems: "center",
    width: (width - PADDING * 2 - 30) / 4,
  },
  quickActionButtonSelected: {
    transform: [{ scale: 1.05 }],
  },
  quickActionIconContainer: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 50,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  quickActionIconSelected: {
    backgroundColor: PRIMARY_COLOR,
    borderColor: PRIMARY_COLOR,
    elevation: 4,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
    textAlign: "center",
  },
  quickActionTextSelected: {
    color: PRIMARY_COLOR,
    fontWeight: "700",
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: TEXT_COLOR,
    paddingHorizontal: PADDING,
    marginBottom: 15,
    marginTop: 15,
  },

  carouselContainer: { marginBottom: 30 },
  carousel: { paddingLeft: PADDING },
  carouselImage: {
    width: width * 0.85,
    height: 180,
    borderRadius: 18,
    marginRight: 16,
    elevation: 8,
  },

  recommendationsContainer: { paddingHorizontal: PADDING },

  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    marginBottom: 25,
    elevation: 4,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#eee",
  },
  cardImage: { width: "100%", height: 160 },
  cardContent: { padding: 15 },
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  cardTitle: { fontSize: 19, fontWeight: "800", color: TEXT_COLOR },
  priceText: { fontSize: 18, fontWeight: "800", color: PRIMARY_COLOR },

  ratingDistanceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  ratingBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginRight: 10,
  },
  ratingText: { fontSize: 14, color: "#fff", marginLeft: 4 },
  dotSeparator: { marginHorizontal: 8, color: "#D1D5DB", fontSize: 18 },
  distanceText: { fontSize: 15, color: "#6B7280", fontWeight: "600" },

  tagsContainer: { flexDirection: "row", flexWrap: "wrap", marginBottom: 15 },
  tag: {
    backgroundColor: "#F3F4F6",
    fontSize: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 6,
    fontWeight: "600",
  },

  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  spotsText: { fontSize: 15, color: "#6B7280" },
  spotsCount: { fontSize: 17, fontWeight: "900", color: TEXT_COLOR },

  reserveButton: {
    flexDirection: "row",
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
  reserveButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
});
