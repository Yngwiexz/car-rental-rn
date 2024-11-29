import {View, Text, Image, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import React, {useEffect} from 'react';
import Button from '../components/Button';
import {useSelector, useDispatch} from 'react-redux';
import {
  getProfile,
  selectUser,
  logout,
  resetState,
} from '../redux/reducers/user';

export default function Profile() {
  const navigation = useNavigation();
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user?.data && user?.token) {
      dispatch(getProfile(user.token));
    }
  }, [user?.data, user?.token, dispatch]);
  

  const handleLogout = () => {
    dispatch(resetState());
  };

  return (
    <View style={styles.centerContent}>
      {!user.isLogin ? (
        <View style={styles.innerContent}>
          <Image
            height={50}
            width={50}
            source={require('../assets/images/Allura.png')}
          />
          <Text style={styles.textCenter}>
            Upss kamu belum memiliki akun. Mulai buat akun agar transaksi di
            TMMIN Car Rental lebih mudah
          </Text>
          <Button
            onPress={() => navigation.navigate('SignUp')}
            title={'Register'}
            color={'#5CB85F'}
          />
        </View>
      ) : (
        <View style={styles.container}>
          <View style={styles.profileHeader}>
            <Image
              source={{uri: user.data?.avatar || 'https://i.pravatar.cc/100'}}
              style={styles.profileImage}
            />
            <View style={styles.userInfo}>
            <Text style={styles.name}>
  Halo, {user.data?.fullname || 'User'}
</Text>
<Text style={styles.email}>
  {user.data?.email || 'user@example.com'}
</Text>
            </View>
          </View>
          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <Text style={styles.label}>Phone</Text>
              <Text style={styles.value}>
  {user.data?.phone || '+62'}
</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.label}>Location</Text>
              <Text style={styles.value}>
  {user.data?.location || 'Kajarta'}
</Text>
            </View>
          </View>
          <Button
            onPress={handleLogout}
            title="Logout"
            color="#A43333"
            style={styles.logoutButton}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20, // memberi jarak di sisi kiri dan kanan
  },
  innerContent: {
    alignItems: 'center', // Memusatkan konten di dalam inner view
  },
  textCenter: {
    textAlign: 'center',
    marginVertical: 10,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#5CB85F', // Warna yang kontras untuk lingkaran avatar
  },
  userInfo: {
    marginLeft: 20,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  email: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  infoContainer: {
    marginTop: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5, // Untuk efek bayangan seperti di aplikasi Gojek
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  label: {
    fontSize: 16,
    color: '#555',
  },
  value: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: '#A43333',
    paddingVertical: 12,
    borderRadius: 8,
  },
});
