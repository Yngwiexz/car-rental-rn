import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  Image,
} from 'react-native';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectOrder,
  setStateByName,
  putOrderSlip,
} from '../../../redux/reducers/order';
import CarList from '../../../components/CarList';
import Button from '../../../components/Button';
import Icon from 'react-native-vector-icons/Feather';
import CountDown from 'react-native-countdown-component-maintained';
import ModalPopup from '../../../components/Modal/Modal';
import formatCurrency from '../../../utils/formatCurrency';
import * as ImagePicker from 'react-native-image-picker';

function getDate24() {
  const date24 = new Date();
  date24.setHours(date24.getHours() + 24);
  return date24.toLocaleString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function Step2() {
  const [image, setImage] = useState(null);
  const { data = {}, selectedBank = {}, isModalVisible, status } = useSelector(selectOrder);
  const dispatch = useDispatch();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
    });

    if (!result.didCancel && !result.errorMessage) {
      const selectedImage = result.assets[0];
      setImage({
        uri: selectedImage.uri,
        name: selectedImage.fileName,
        type: selectedImage.type,
      });
    } else if (result.errorMessage) {
      Alert.alert('Error', result.errorMessage);
    }
  };

  const handleUpload = () => {
    if (!image) {
      Alert.alert('Error', 'Silakan pilih gambar terlebih dahulu.');
      return;
    }

    const formData = new FormData();
    formData.append('slip', image);

    dispatch(
      putOrderSlip({
        token: data.access_token,
        id: data.id,
        formData,
      })
    );
  };

  useEffect(() => {
    if (status === 'upload-success') {
      dispatch(setStateByName({ name: 'activeStep', value: 2 }));
    }
  }, [status, dispatch]);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.countDownWrapper}>
          <Text style={styles.countDownText}>Selesaikan Pembayaran Sebelum</Text>
          <CountDown
            until={86400}
            digitStyle={{ backgroundColor: '#FA2C5A' }}
            digitTxtStyle={{ color: '#fff' }}
            timeLabelStyle={{ display: 'none' }}
            onFinish={() => Alert.alert('Waktu pembayaran selesai')}
            timeToShow={['H', 'M', 'S']}
            size={12}
          />
        </View>
        <Text style={styles.countDownDate}>{getDate24()}</Text>
        <CarList
          image={{ uri: data?.image || 'https://via.placeholder.com/200' }}
          carName={data?.name || 'Nama tidak tersedia'}
          passengers={data?.passengers || 0}
          baggage={data?.baggage || 0}
          price={data?.price || 0}
        />
      </View>

      <ModalPopup
        isVisible={isModalVisible}
        onClose={() => {
          dispatch(setStateByName({ name: 'isModalVisible', value: false }));
        }}
      >
        <Pressable style={styles.uploadImage} onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image.uri }} resizeMode="cover" style={styles.image} />
          ) : (
            <View style={styles.iconUpload}>
              <Icon color={'#3C3C3C'} name={'image-outline'} size={14} />
            </View>
          )}
        </Pressable>
        <Button title="Upload" color="#3D7B3F" onPress={handleUpload} />
      </ModalPopup>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  countDownWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  countDownText: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  countDownDate: {
    fontSize: 14,
    marginBottom: 10,
  },
  uploadImage: {
    height: 400,
    backgroundColor: '#D0D0D0',
  },
  image: {
    height: 400,
    width: '100%',
  },
});
