import {
  KeyboardAvoidingView,
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Button from '../components/Button';
import {Link, useNavigation} from '@react-navigation/native';
import ModalPopup from '../components/Modal/Modal';
import Icon from 'react-native-vector-icons/Feather';
// redux
import {useDispatch, useSelector} from 'react-redux';
import {postRegister, selectUser, resetState} from '../redux/reducers/user';

const initialFormState = {
  fullname: '',
  email: '',
  password: '',
};

export default function SignUp() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const user = useSelector(selectUser); // (state) => state.user
  const [modalVisible, setModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [formData, setFormData] = useState(initialFormState);

  const handleChange = (val, name) => {
    setFormData(prevState => ({
      ...prevState,
      [name]: val,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.fullname || !formData.email || !formData.password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    await dispatch(postRegister(formData));
  };

  

  useEffect(() => {
    // Reset state when the component mounts
    dispatch(resetState());
  }, []);

  useEffect(() => {
    if (user.status === 'success') {
      setModalVisible(true);
      setErrorMessage(null);
      setTimeout(() => {
        setModalVisible(false);
        navigation.navigate('SignIn');
      }, 1000);
    } else if (user.status === 'failed') {
      setModalVisible(true);
      setErrorMessage(user.message);
      setTimeout(() => {
        setModalVisible(false);
      }, 2000);
    }
  }, [navigation, user]);

  return (
    <ScrollView>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.authWrapper}>
        <View style={{flex: 1}}>
          <Image source={require('../assets/images/TMMIN.png')} />
          <Text style={styles.authTitle}>Sign Up</Text>
          <View>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                onChangeText={text => handleChange(text, 'fullname')}
              />
            </View>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Contoh: johndee@gmail.com"
                keyboardType="email-address"
                onChangeText={text => handleChange(text, 'email')}
              />
            </View>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput
                style={styles.input}
                secureTextEntry={true}
                placeholder="6+ Karakter"
                onChangeText={text => handleChange(text, 'password')}
              />
            </View>
            <Button onPress={handleSubmit} title="Sign Up" color="#5CB85F" />
          </View>
          <View>
            <Text style={styles.authFooterText}>
              Already have an account?{' '}
              <Link screen= {'SignIn'}>Sign In here</Link>
            </Text>
          </View>
          <ModalPopup visible={modalVisible}>
            <View style={styles.modalBackground}>
              {errorMessage !== null ? (
                <>
                  <Icon size={32} name={'x-circle'} />
                  {Array.isArray(errorMessage) ? (
                    errorMessage.map((e, index) => (
                      <Text key={index}>{e.message}</Text>
                    ))
                  ) : (
                    <Text>{errorMessage}</Text>
                  )}
                </>
              ) : (
                <>
                  <Icon size={32} name="check-circle" />
                  <Text>Berhasil Register!</Text>
                </>
              )}
            </View>
          </ModalPopup>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  authWrapper: {
    flex: 1,
    padding: 20,
  },
  authTitle: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    marginVertical: 20,
  },
  inputWrapper: {
    marginBottom: 20,
  },
  inputLabel: {
    fontWeight: '700',
  },
  input: {
    borderWidth: 1,
    marginTop: 10,
    paddingHorizontal: 10,
  },
  authFooterText: {
    marginTop: 10,
    fontWeight: '500',
    textAlign: 'center',
  },
  modalBackground: {
    width: '90%',
    backgroundColor: '#fff',
    elevation: 20,
    borderRadius: 4,
    padding: 20,
  },
});
