import { useState, useEffect } from 'react';
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import CarList from '../components/CarList';

const COLORS = {
  primary: '#A43333',
  secondary: '#5CB85F',
  darker: '#121212',
  lighter: '#ffffff',
};

function List() {
  const [cars, setCars] = useState([]);
  const isDarkMode = useColorScheme() === 'dark';
const navigation = useNavigation()
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await axios.get(
          'https://guilty-estele-flatearth-63063b98.koyeb.app/api/v1/cars'
        );  
        console.log(res.data);
        setCars(res.data.data); // Asumsi bahwa `res.data.data` adalah array mobil
      } catch (e) {
        console.log(e);
      }
    };
    fetchCars();
  }, []);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? COLORS.darker : COLORS.lighter,
  };

  return (
    <SafeAreaView style={[styles.container, backgroundStyle]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={COLORS.primary}
      />
      <View style={styles.listContainer}>
        <FlatList
          data={cars}
          renderItem={({ item }) => (
            <CarList
              image={{ uri: item.img }}
              carName={item.name}
              passengers={5}
              baggage={4}
              price={item.price}
              onPress={ () => navigation.navigate('CarDetail', {carId : item.id}) }
            />
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
});

export default List;
