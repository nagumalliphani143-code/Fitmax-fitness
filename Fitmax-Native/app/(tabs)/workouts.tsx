import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Polyline, Marker } from 'react-native-maps';
import { COLORS } from '@/constants/theme';
import { usePedometer } from '@/hooks/usePedometer';
import { MapPin, Play, Square } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

export default function GPSTracker() {
  const { totalSteps } = usePedometer();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [route, setRoute] = useState<Location.LocationObject[]>([]);
  const [isTracking, setIsTracking] = useState(false);
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;

    if (isTracking) {
      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          alert('Permission to access location was denied');
          return;
        }

        subscription = await Location.watchPositionAsync(
          { accuracy: Location.Accuracy.High, distanceInterval: 5 },
          (loc) => {
            setLocation(loc);
            setRoute(prev => [...prev, loc]);
            if (prev.length > 0) {
              const last = prev[prev.length - 1];
              const d = calculateDistance(last.coords, loc.coords);
              setDistance(prevDist => prevDist + d);
            }
          }
        );
      })();
    } else {
      subscription?.remove();
    }

    return () => subscription?.remove();
  }, [isTracking]);

  const calculateDistance = (c1: any, c2: any) => {
    const R = 6371e3; // metres
    const φ1 = c1.latitude * Math.PI/180;
    const φ2 = c2.latitude * Math.PI/180;
    const Δφ = (c2.latitude-c1.latitude) * Math.PI/180;
    const Δλ = (c2.longitude-c1.longitude) * Math.PI/180;
    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation
      >
        <Polyline coordinates={route.map(p => ({ latitude: p.coords.latitude, longitude: p.coords.longitude }))} strokeColor={COLORS.brand.cyan} strokeWidth={5} />
      </MapView>

      <View style={styles.overlay}>
        <View style={styles.statsCard}>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Distance</Text>
            <Text style={styles.statValue}>{(distance / 1000).toFixed(2)} km</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Steps</Text>
            <Text style={styles.statValue}>{totalSteps}</Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => setIsTracking(!isTracking)}
          style={[styles.trackButton, { backgroundColor: isTracking ? COLORS.brand.coral : COLORS.brand.emerald }]}
        >
          {isTracking ? <Square color="white" fill="white" size={24} /> : <Play color="white" fill="white" size={24} />}
          <Text style={styles.buttonText}>{isTracking ? 'Stop Workout' : 'Start GPS Track'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { position: 'absolute', bottom: 40, left: 20, right: 20, alignItems: 'center' },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    width: '100%',
    justifyContent: 'space-around',
    marginBottom: 20
  },
  stat: { alignItems: 'center' },
  statLabel: { color: COLORS.text.secondary, fontSize: 12, marginBottom: 4 },
  statValue: { color: 'white', fontSize: 20, fontWeight: '900' },
  trackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    width: '100%',
    justifyContent: 'center'
  },
  buttonText: { color: 'white', fontWeight: '900', fontSize: 18 }
});
