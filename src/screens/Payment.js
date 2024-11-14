import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { formatCurrency } from '../utils/formatCurrency';

export default function PaymentScreen() {
  const [activeStep, setActiveStep] = useState(1);
  const [selectedBank, setSelectedBank] = useState('');
  const [cars, setCars] = useState(null);
  const [promoCode, setPromoCode] = useState('');
  const navigation = useNavigation();
  const formatIDR = useCallback((price) => formatCurrency.format(price), []);

  const getCars = async () => {
    try {
      const storedCars = await AsyncStorage.getItem('cars');
      if (storedCars) {
        setCars(JSON.parse(storedCars));
      }
    } catch (e) {
      console.log('Error loading car details:', e);
    }
  };

  useEffect(() => {
    getCars();
  }, []);

  const steps = [
    { id: 1, title: 'Pilih Metode' },
    { id: 2, title: 'Bayar' },
    { id: 3, title: 'Tiket' },
  ];

  const banks = [
    { id: 'bca', name: 'BCA', subtitle: 'BCA Transfer' },
    { id: 'bni', name: 'BNI', subtitle: 'BNI Transfer' },
    { id: 'mandiri', name: 'Mandiri', subtitle: 'Mandiri Transfer' },
  ];

  const renderStepIndicator = () => (
    <View style={styles.stepContainer}>
      {steps.map((step, index) => (
        <View key={step.id} style={styles.stepWrapper}>
          <View style={styles.stepNumberWrapper}>
            <View
              style={[
                styles.stepNumber,
                {
                  backgroundColor: step.id <= activeStep ? '#22c55e' : '#e5e7eb',
                },
              ]}
            >
              <Text
                style={[
                  styles.stepNumberText,
                  { color: step.id <= activeStep ? 'white' : '#6b7280' },
                ]}
              >
                {step.id}
              </Text>
            </View>
            <Text style={styles.stepTitle}>{step.title}</Text>
          </View>
          {index < steps.length - 1 && (
            <View
              style={[
                styles.stepLine,
                { backgroundColor: step.id < activeStep ? '#22c55e' : '#e5e7eb' },
              ]}
            />
          )}
        </View>
      ))}
    </View>
  );

  if (!cars) {
    return (
      <View style={styles.loadingContainer}>
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
        <Text style={styles.headerTitle}>Pembayaran</Text>
      </View>

      {/* Step Indicator */}
      {renderStepIndicator()}

      <ScrollView style={styles.content}>
        {/* Car Details */}
        <View style={styles.carDetails}>
          <Image source={{ uri: cars.img }} style={styles.carImage} />
          <View style={styles.carInfo}>
            <Text style={styles.carName}>{cars.name}</Text>
            <View style={styles.carMetrics}>
              <View style={styles.metric}>
                <Icon name="users" size={16} color="#6b7280" />
                <Text style={styles.metricText}>{cars.passengers}</Text>
              </View>
              <View style={styles.metric}>
                <Icon name="briefcase" size={16} color="#6b7280" />
                <Text style={styles.metricText}>{cars.baggage}</Text>
              </View>
            </View>
          </View>
          <Text style={styles.price}>{formatIDR(cars.price)}</Text>
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pilih Bank Transfer</Text>
          <Text style={styles.sectionDescription}>
            Kamu bisa membayar dengan transfer melalui ATM, Internet Banking atau Mobile Banking
          </Text>

          {banks.map((bank) => (
            <TouchableOpacity
              key={bank.id}
              style={[
                styles.bankOption,
                selectedBank === bank.id && styles.bankOptionSelected,
              ]}
              onPress={() => setSelectedBank(bank.id)}
            >
              <View style={styles.bankInfo}>
                <Text style={styles.bankName}>{bank.name}</Text>
                <Text style={styles.bankSubtitle}>{bank.subtitle}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Promo Code */}
        <View style={styles.promoSection}>
          <View style={styles.promoHeader}>
            <Icon name="percent" size={20} color="#6b7280" />
            <Text style={styles.promoTitle}>Pakai Kode Promo</Text>
          </View>
          <View style={styles.promoInputContainer}>
            <TextInput
              style={styles.promoInput}
              placeholder="Masukkan kode promo"
              value={promoCode}
              onChangeText={setPromoCode}
            />
            <TouchableOpacity
              style={[
                styles.promoButton,
                !promoCode && styles.promoButtonDisabled,
              ]}
              disabled={!promoCode}
            >
              <Text style={styles.promoButtonText}>Terapkan</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        <View style={styles.totalPrice}>
          <Text style={styles.totalPriceText}>{formatIDR(cars.price)}</Text>
          <Icon name="chevron-down" size={20} color="#000" />
        </View>
        <TouchableOpacity
          style={[styles.payButton, !selectedBank && styles.payButtonDisabled]}
          disabled={!selectedBank}
        >
          <Text style={styles.payButtonText}>Bayar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 16,
  },
  stepContainer: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  stepWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepNumberWrapper: {
    alignItems: 'center',
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    fontSize: 12,
    fontWeight: '600',
  },
  stepTitle: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  stepLine: {
    flex: 1,
    height: 2,
    marginHorizontal: 8,
  },
  content: {
    flex: 1,
  },
  carDetails: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    alignItems: 'center',
  },
  carImage: {
    width: 60,
    height: 40,
    borderRadius: 4,
  },
  carInfo: {
    flex: 1,
    marginLeft: 12,
  },
  carName: {
    fontSize: 16,
    fontWeight: '600',
  },
  carMetrics: {
    flexDirection: 'row',
    marginTop: 4,
  },
  metric: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  metricText: {
    marginLeft: 4,
    color: '#6b7280',
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: '#22c55e',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  bankOption: {
    flexDirection: 'row',
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    marginBottom: 8,
  },
  bankOptionSelected: {
    borderColor: '#22c55e',
    backgroundColor: '#f0fdf4',
  },
  bankInfo: {
    flex: 1,
  },
  bankName: {
    fontSize: 16,
    fontWeight: '500',
  },
  bankSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  promoSection: {
    padding: 16,
  },
  promoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  promoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  promoInputContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  promoInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
  },
  promoButton: {
    backgroundColor: '#22c55e',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
  },
  promoButtonDisabled: {
    backgroundColor: '#e5e7eb',
  },
  promoButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  bottomSection: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  totalPrice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  totalPriceText: {
    fontSize: 18,
    fontWeight: '600',
  },
  payButton: {
    backgroundColor: '#3D7B3F',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  payButtonDisabled: {
    backgroundColor: '#C9E7CA',
  },
  payButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

