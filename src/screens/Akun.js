import { View, Text, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import Button from '../components/Button';
import { useSelector, useDispatch } from 'react-redux';
import { getProfile, selectUser, logout, resetState } from '../redux/reducers/user';

export default function Akun() {
    const navigation = useNavigation();
    const user = useSelector(selectUser);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!user.data && user.token) {
            dispatch(getProfile(user.token));
        }
    }, [user, dispatch]);

    const handleLogin = () => {
      dispatch(logout());
      dispatch(resetState());
    }

    return (
        <View style={styles.centerContent}>
            {
                !user.isLogin ? (
                    <View style={styles.innerContent}>
                        <Image
                            height={50}
                            width={50}
                            source={require('../assets/images/Allura.png')}
                            style={styles.profileImage}
                        />
                        <Text style={styles.textCenter}>
                            Upss kamu belum memiliki akun. Mulai buat akun agar transaksi di TMMIN Car Rental lebih mudah
                        </Text>
                        <Button
                            onPress={() => navigation.navigate('SignUp')}
                            title={'Register'}
                            color={'#5CB85F'}
                        />
                    </View>
                ) : (
                    <View style={styles.innerContent}>
                        <Image
                            height={50}
                            width={50}
                            source={{ uri: user.data?.avatar || "https://i.pravatar.cc/100" }}
                            style={styles.profileImage}
                        />
                        <Text style={styles.textCenter}>Halo, {user.data?.fullname}</Text>
                        <Button
                            onPress={handleLogin}
                            title={'Logout'}
                            color={'#A43333'}
                        />
                    </View>
                )
            }
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
});
