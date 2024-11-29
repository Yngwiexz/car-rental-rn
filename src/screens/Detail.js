import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

import {useState, useEffect} from 'react';
import Icon from 'react-native-vector-icons/Feather';

import Markdown from 'react-native-markdown-display';
import Button from '../components/Button';
import {Row, Col} from '../components/Grid';
import {useNavigation} from '@react-navigation/native';
import {formatCurrency} from '../utils/formatCurrency';
import {useDispatch, useSelector} from 'react-redux';
import {
  selectCarDetail,
  getCarsDetails,
  resetDetailsState,
} from '../redux/reducers/cars';

// const md = `## Include

// - Apa saja yang termasuk dalam paket misal durasi max 12 jam
// - Sudah termasuk bensin selama 12 jam
// - Sudah termasuk Tiket Wisata
// - Sudah termasuk pajak

// ## Exclude

// - Tidak termasuk biaya makan sopir Rp 75.000/hari
// - Jika overtime lebih dari 12 jam akan ada tambahan biaya Rp 20.000/jam
// - Tidak termasuk akomodasi penginapan`.toString();

export default function Detail({route}) {
  const navigation = useNavigation();
  const {id} = route.params;
  const dispatch = useDispatch();
  const carDetail = useSelector(selectCarDetail);

  useEffect(() => {
    dispatch(resetDetailsState())
    if(id !== carDetail.id){
        dispatch(getCarsDetails(id));
    }
}, [id]);

  if (carDetail?.status === 'loading' || !carDetail?.data) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Button style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon size={32} name="arrow-left" color="#000000" />
      </Button>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.heading}>
          <Text style={styles.title}>
            {carDetail?.data?.name || 'Unknown Car'}
          </Text>
          <Row style={styles.iconWrapper} gap={5}>
            <Col style={styles.textIcon}>
              <Icon size={14} name="users" color="#8A8A8A" />
              <Text style={styles.capacityText}>
                {carDetail?.data?.seat || 'N/A'}
              </Text>
            </Col>
            <Col style={styles.textIcon}>
              <Icon size={14} name="briefcase" color="#8A8A8A" />
              <Text style={styles.capacityText}>
                {carDetail?.data?.baggage || 'N/A'}
              </Text>
            </Col>
          </Row>
          <Image
            style={styles.image}
            source={{
              uri: carDetail.data?.img || 'https://via.placeholder.com/200',
            }}
            height={200}
            width={200}
            resizeMode="contain"
          />
        </View>
        <Markdown style={styles.markdown}>
          {carDetail?.data?.description?.replace(/\\n/g, '\n') || 'No description available.'}
        </Markdown>
      </ScrollView>
      <View style={styles.footer}>
        <Text style={styles.price}>
          {formatCurrency.format(carDetail?.data?.price || 0)}
        </Text>
        <Button
          color="#3D7B3F"
          title="Lanjutkan Pembayaran"
          onPress={() =>
            navigation.navigate('Order', {carId: carDetail?.data?.id})
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 80, // Memberi ruang untuk footer
  },
  heading: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
  },
  iconWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  textIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  capacityText: {
    fontSize: 14,
    color: '#8A8A8A',
    marginLeft: 5,
  },
  image: {
    height: 200,
    width: '100%',
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  footer: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderColor: '#eeeeee',
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    elevation: 3, // Memberikan efek bayangan pada footer
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 10,
    zIndex: 9,
    backgroundColor: '#ffffff',
    padding: 8,
    borderRadius: 50,
    elevation: 3, // Bayangan untuk tombol
  },
  markdown: {
    body: {
      fontSize: 14,
      color: '#555555',
      marginVertical: 10,
    },
    heading1: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#333333',
      marginVertical: 10,
    },
    heading2: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#333333',
      marginVertical: 8,
    },
    heading3: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333333',
      marginVertical: 6,
    },
    link: {
      color: '#3D7B3F',
      textDecorationLine: 'underline',
    },
    listItem: {
      fontSize: 14,
      color: '#555555',
      marginBottom: 5,
    },
    blockquote: {
      borderLeftWidth: 4,
      borderLeftColor: '#8A8A8A',
      paddingLeft: 10,
      fontStyle: 'italic',
      color: '#8A8A8A',
      marginVertical: 10,
    },
    codeInline: {
      fontFamily: 'monospace',
      fontSize: 14,
      backgroundColor: '#f5f5f5',
      padding: 4,
      borderRadius: 4,
    },
    codeBlock: {
      fontFamily: 'monospace',
      fontSize: 14,
      backgroundColor: '#f5f5f5',
      padding: 10,
      borderRadius: 4,
      marginVertical: 10,
    },
  },  
});
