import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { formatCurrency } from '../utils/formatCurrency';

const CarDetail = ({ route }) => {
  const { carId } = route.params;
  const [car, setCar] = useState(null);
  const navigation = useNavigation();
  const formatIDR = useCallback((price) => formatCurrency.format(price), []);

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const res = await axios.get(`https://guilty-estele-flatearth-63063b98.koyeb.app/api/v1/cars/${carId}`);
        const { data } = res.data;
        setCar(data);
        await AsyncStorage.setItem('cars', JSON.stringify(data));
      } catch (e) {
        console.log('Error fetching car details:', e);
      }
    };
    fetchCarDetails();
  }, [carId]);

  if (!car) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{car.name}</Text>
          <View style={styles.headerInfo}>
            <View style={styles.infoItem}>
              <Icon name="users" size={16} color="#6b7280" />
              <Text style={styles.infoText}>{car.passengers}</Text>
            </View>
            <View style={styles.infoItem}>
              <Icon name="briefcase" size={16} color="#6b7280" />
              <Text style={styles.infoText}>{car.baggage}</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Car Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: car.img }}
            style={styles.carImage}
            resizeMode="contain"
          />
          <View style={styles.imageDots}>
            <View style={[styles.dot, styles.activeDot]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
        </View>

        {/* Package Details */}
        <View style={styles.packageDetails}>
          <Text style={styles.sectionTitle}>Tentang Paket</Text>

          <View style={styles.detailSection}>
            <Text style={styles.detailTitle}>Include</Text>
            <Text style={styles.detailText}>• Apa saja yang termasuk dalam paket misal durasi max 12 jam</Text>
            <Text style={styles.detailText}>• Sudah termasuk bensin selama 12 jam</Text>
            <Text style={styles.detailText}>• Sudah termasuk Tiket Wisata</Text>
            <Text style={styles.detailText}>• Sudah termasuk pajak</Text>
          </View>

          <View style={styles.detailSection}>
            <Text style={styles.detailTitle}>Exclude</Text>
            <Text style={styles.detailText}>• Tidak termasuk biaya makan sopir Rp 75.000/hari</Text>
            <Text style={styles.detailText}>• Jika overtime lebih dari 12 jam akan ada tambahan biaya Rp 20.000/jam</Text>
            <Text style={styles.detailText}>• Tidak termasuk akomodasi</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Fixed Section */}
      <View style={styles.bottomSection}>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>{formatIDR(car.price)}</Text>
        </View>
        <TouchableOpacity
          style={styles.paymentButton}
          onPress={() => navigation.navigate('PaymentScreen', { carId })}
        >
          <Text style={styles.paymentButtonText}>Lanjutkan Pembayaran</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    padding: 8,
  },
  headerContent: {
    marginLeft: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  headerInfo: {
    flexDirection: 'row',
    marginTop: 4,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  infoText: {
    marginLeft: 4,
    color: '#6b7280',
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    aspectRatio: 4 / 3,
    backgroundColor: '#f3f4f6',
    position: 'relative',
    alignItems: 'center',
  },
  carImage: {
    width: '80%',
    height: '90%',
  },
  imageDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#d1d5db',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#4b5563',
  },
  packageDetails: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  detailSection: {
    marginBottom: 16,
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  bottomSection: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  priceContainer: {
    marginBottom: 16,
  },
  price: {
    fontSize: 18,
    fontWeight: '600',
  },
  paymentButton: {
    backgroundColor: '#3D7B3F',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  paymentButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CarDetail;
