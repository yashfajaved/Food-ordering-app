import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet, Text, View, FlatList, TouchableOpacity, StatusBar,
  Animated, ActivityIndicator, Alert, ImageBackground, Dimensions,
  TextInput, Image, Easing, ScrollView
} from 'react-native';

const { width, height } = Dimensions.get('window');

const COLORS = {
  bg: '#2E1F1B',
  card: '#3D2B24',
  accent: '#D9B99B',
  textMain: '#FFFFFF',
  textDim: '#E0D5CC',
  border: '#1A0F0A',
  highlight: '#5E4B43'
};

const CUISINES = ['All', 'Continental', 'Desi', 'Italian', 'Cafe', 'Chinese', 'Fast Food', 'Japanese', 'Mexican'];

const API_URL = 'http://192.168.0.104/leohub_api';

export default function FoodApp() {
  const [activeScreen, setActiveScreen] = useState('Home');
  const [restaurants, setRestaurants] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const shineAnim = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    fetchRestaurants();
    startShine();
    startAnimation();
  }, []);

  const startAnimation = () => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  };

  const startShine = () => {
    Animated.loop(
      Animated.timing(shineAnim, {
        toValue: width,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  };

  const fetchRestaurants = () => {
    setLoading(true);
    fetch(`${API_URL}/get_restaurants.php`)
      .then(res => res.json())
      .then(json => {
        setRestaurants(json);
        setFilteredData(json);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
        Alert.alert("Database Error", "Connection failed! Make sure XAMPP/WAMP is running.");
      });
  };

  const handleFilter = (cuisine) => {
    setSelectedCuisine(cuisine);
    let filtered = restaurants;

    if (cuisine !== 'All') {
      filtered = restaurants.filter(item => item.cuisine === cuisine);
    }

    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredData(filtered);
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    let filtered = restaurants;

    if (selectedCuisine !== 'All') {
      filtered = restaurants.filter(item => item.cuisine === selectedCuisine);
    }

    if (text) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(text.toLowerCase())
      );
    }

    setFilteredData(filtered);
  };

  const SubPage = ({ title, item, onBack }) => (
    <View style={styles.container}>
      <ImageBackground source={{ uri: item?.image_url }} style={styles.bgImage} blurRadius={10}>
        <View style={styles.overlay}>
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <Text style={styles.backText}>← BACK TO MENU</Text>
          </TouchableOpacity>
          <View style={styles.glassCard}>
            <View style={styles.logoBox}><Text style={styles.logoText}>Z</Text></View>
            <Text style={styles.subPageTitle}>{item?.name}</Text>
            <Text style={styles.infoText}>
              Cuisine: {item?.cuisine}{'\n'}
              Rating: ★ {item?.rating}{'\n'}
              Time: {item?.delivery_time}{'\n'}
              Price: {item?.price_range}{'\n'}
              Location: {item?.location}
            </Text>
            <TouchableOpacity style={styles.actionBtn} onPress={() => {
              Alert.alert("Order Placed", "Your food is on the way!");
              onBack();
            }}>
              <Text style={styles.actionBtnText}>Confirm Order</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );

  if (loading) return (
    <View style={[styles.container, { justifyContent: 'center', backgroundColor: COLORS.bg }]}>
      <ActivityIndicator size="large" color={COLORS.accent} />
    </View>
  );

  if (activeScreen === 'Details') return <SubPage title="Order Details" item={selectedItem} onBack={() => setActiveScreen('Home')} />;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ImageBackground source={{ uri: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c' }} style={styles.bgImage} blurRadius={5}>
        <View style={styles.overlay}>

          <View style={styles.header}>
            <View>
              <Text style={styles.welcomeText}>Walnut Noir</Text>
              <Text style={styles.subHeaderText}>Developer: Yashfa Javed</Text>
            </View>
            <TouchableOpacity style={styles.profileBadge}>
              <Text style={styles.profileText}>YJ</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <TextInput
              placeholder="Search restaurants..."
              placeholderTextColor={COLORS.textDim}
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={handleSearch}
            />
            <Animated.View style={[styles.shineEffect, { transform: [{ translateX: shineAnim }] }]} />
          </View>

          <View style={styles.filterRow}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {CUISINES.map(c => (
                <TouchableOpacity
                  key={c}
                  onPress={() => handleFilter(c)}
                  style={[styles.filterBtn, selectedCuisine === c && { backgroundColor: COLORS.accent, borderColor: COLORS.accent }]}>
                  <Text style={[styles.filterText, selectedCuisine === c && { color: COLORS.bg }]}>{c}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <FlatList
            data={filteredData}
            keyExtractor={item => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.resCard}
                onPress={() => {
                  setSelectedItem(item);
                  setActiveScreen('Details');
                }}>
                <Image source={{ uri: item.image_url }} style={styles.resImage} />
                <View style={styles.resInfo}>
                  <View style={styles.resHeader}>
                    <Text style={styles.resName}>{item.name}</Text>
                    <View style={styles.ratingBox}>
                      <Text style={styles.resRating}>★ {item.rating}</Text>
                    </View>
                  </View>
                  <View style={styles.dividerSmall} />
                  <Text style={styles.resCuisine}>{item.cuisine} • {item.delivery_time}</Text>
                  <Text style={styles.resLocation}>{item.location} • {item.price_range}</Text>
                </View>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyEmoji}>🍔</Text>
                <Text style={styles.emptyText}>No restaurants found</Text>
                <Text style={styles.emptySub}>Try a different cuisine or search term</Text>
              </View>
            }
          />
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  bgImage: { flex: 1, width: width, height: height },
  overlay: { flex: 1, backgroundColor: 'rgba(46, 31, 27, 0.88)', paddingHorizontal: 20 },
  header: { paddingTop: 60, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  welcomeText: { color: COLORS.accent, fontSize: 28, fontWeight: 'bold', letterSpacing: 1 },
  subHeaderText: { color: COLORS.textDim, fontSize: 14 },
  profileBadge: { width: 48, height: 48, borderRadius: 12, backgroundColor: COLORS.accent, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: COLORS.border },
  profileText: { color: COLORS.bg, fontWeight: 'bold', fontSize: 16 },
  searchContainer: { height: 55, backgroundColor: COLORS.card, borderRadius: 15, borderWidth: 2, borderColor: COLORS.border, overflow: 'hidden', justifyContent: 'center', marginBottom: 20 },
  searchInput: { paddingHorizontal: 20, color: COLORS.textMain, fontSize: 16 },
  shineEffect: { position: 'absolute', width: 60, height: '100%', backgroundColor: 'rgba(255,255,255,0.15)', transform: [{ skewX: '-25deg' }] },
  filterRow: { marginBottom: 20 },
  filterBtn: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 10, backgroundColor: COLORS.highlight, marginRight: 10, borderWidth: 1, borderColor: COLORS.border },
  filterText: { color: COLORS.textDim, fontWeight: 'bold' },
  resCard: { backgroundColor: COLORS.card, borderRadius: 22, marginBottom: 20, overflow: 'hidden', borderWidth: 3, borderColor: COLORS.border, elevation: 12 },
  resImage: { width: '100%', height: 170 },
  resInfo: { padding: 18 },
  resHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  resName: { color: COLORS.textMain, fontSize: 21, fontWeight: 'bold' },
  ratingBox: { backgroundColor: 'rgba(217, 185, 155, 0.2)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  resRating: { color: COLORS.accent, fontWeight: 'bold', fontSize: 14 },
  dividerSmall: { height: 2, backgroundColor: 'rgba(217, 185, 155, 0.1)', marginVertical: 10, width: 50 },
  resCuisine: { color: COLORS.textDim, fontSize: 15 },
  resLocation: { color: COLORS.textDim, fontSize: 12, marginTop: 4 },
  glassCard: { marginTop: height * 0.1, backgroundColor: 'rgba(61, 43, 36, 0.96)', padding: 35, borderRadius: 30, borderWidth: 4, borderColor: COLORS.border, alignItems: 'center', elevation: 25 },
  logoBox: { width: 50, height: 50, backgroundColor: COLORS.bg, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginBottom: 15, borderWidth: 2, borderColor: COLORS.accent },
  logoText: { color: COLORS.accent, fontSize: 24, fontWeight: 'bold' },
  subPageTitle: { color: COLORS.accent, fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 15 },
  infoText: { color: COLORS.textMain, fontSize: 18, textAlign: 'center', lineHeight: 28, marginBottom: 30 },
  actionBtn: { backgroundColor: COLORS.accent, paddingVertical: 16, paddingHorizontal: 50, borderRadius: 15, borderWidth: 2, borderColor: COLORS.border },
  actionBtnText: { color: COLORS.bg, fontWeight: 'bold', fontSize: 18 },
  backBtn: { marginTop: 60, marginBottom: 20 },
  backText: { color: COLORS.accent, fontWeight: 'bold', fontSize: 16, letterSpacing: 1 },
  emptyContainer: { alignItems: 'center', paddingTop: 100 },
  emptyEmoji: { fontSize: 64, marginBottom: 20 },
  emptyText: { color: COLORS.textMain, fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  emptySub: { color: COLORS.textDim, fontSize: 14 },
});