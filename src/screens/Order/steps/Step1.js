import { View, Text, TextInput, StyleSheet, Pressable, Modal, ActivityIndicator } from 'react-native';
import DateTimePicker from 'react-native-ui-datepicker';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectOrder, setFormData, getOrderDetails } from '../../../redux/reducers/order';
import { getCarsDetails, selectCarDetail } from '../../../redux/reducers/cars';
import CarList from '../../../components/CarList';
import Button from '../../../components/Button';
import Icon from 'react-native-vector-icons/Feather';
import SelectDropdown from 'react-native-select-dropdown';

const paymentMethods = [
  { bankName: 'BCA', account: 12345678, name: 'a. n Super Travel' },
  { bankName: 'MANDIRI', account: 12345678, name: 'a. n Super Travel' },
  { bankName: 'BNI', account: 12345678, name: 'a. n Super Travel' },
];

const options = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
};

const formatDate = (date) => new Date(date).toLocaleString('id-ID', options)

export default function Step1({route}) {
  const orderId = route?.params?.orderId;
  const carId = route?.params?.carId;
  const [promoText, setPromoText] = useState(null);
  const { formData, status:orderStatus } = useSelector(selectOrder);
  const { data, status:carStatus } = useSelector(selectCarDetail);
  const dispatch = useDispatch();

  const [datePickerModal, setDatePickerModal] = useState({
    visible: false,
    currentInput: 'start_time'
  })

  const openDateTimePicker = (inputName) => {
    setDatePickerModal({
      visible: true,
      currentInput: inputName
    })
  }

  const handleInputChange = (name, value) => {
    dispatch(setFormData({name, value}))
  }

  const minDate = (date) => {
    const newDate = new Date(date)
    return newDate.setDate(newDate.getDate() + 1);
  }

  const dateTimePickerHandler = (params) => {
    console.log(formData)
    handleInputChange(datePickerModal.currentInput, params.date)
  }

  useEffect(() => {
    if(orderId && carId){
      getOrderDetails(orderId)
      getCarsDetails(carId)
    }
    handleInputChange('car_id', data.id)
  }, []);

  if (orderStatus === 'loading' || carStatus === 'loading') { return <ActivityIndicator />; }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <CarList
          image={{ uri: data?.img }}
          carName={data?.name}
          passengers={5}
          baggage={4}
          price={data.price}
        />
        <Text style={styles.textBold}>Pilih Opsi Sewa</Text>
        <View style={styles.inputWrapper}>
          <Text style={styles.inputLabel}>Tanggal Ambil</Text>
          <Pressable style={styles.inputDate} onPress={() => openDateTimePicker('start_time')}>
            <Text>{formData.start_time ? formatDate(formData.start_time) : 'Pilih Tanggal Ambil'}</Text>
          </Pressable>
        </View>
        <View style={styles.inputWrapper}>
          <Text style={styles.inputLabel}>Tanggal Kembali</Text>
          <Pressable style={styles.inputDate} onPress={() => openDateTimePicker('end_time')}>
            <Text>{formData.end_time ? formatDate(formData.end_time) : 'Pilih Tanggal Kembali'}</Text>
          </Pressable>
        </View>
        <View style={styles.inputWrapper}>
          <Text style={styles.inputLabel}>Tipe Supir</Text>
          <SelectDropdown
            data={[
              ...!data.isDriver && [{
                title: 'Lepas Kunci',
                value: false,
              }],
              {
                title: 'Dengan Sopir',
                value: false,
              }]}
            onSelect={(selectedItem, index) => {
              handleInputChange('is_driver', selectedItem.value)
            }}
            defaultValue={formData.is_driver}
            renderButton={(selectedItem, isOpened) => {
              return (
                <View style={styles.dropdownButtonStyle}>
                  {selectedItem && (
                    <Icon name={selectedItem.icon} style={styles.dropdownButtonIconStyle} />
                  )}
                  <Text style={styles.dropdownButtonTxtStyle}>
                    {(selectedItem && selectedItem.title) || 'Pilih supir'}
                  </Text>
                  <Icon name={isOpened ? 'chevron-up' : 'chevron-down'} style={styles.dropdownButtonArrowStyle} />
                </View>
              );
            }}
            renderItem={(item, index, isSelected) => {
              return (
                <View style={{ ...styles.dropdownItemStyle, ...(isSelected && { backgroundColor: '#D2D9DF' }) }}>
                  <Icon name={item.icon} style={styles.dropdownItemIconStyle} />
                  <Text style={styles.dropdownItemTxtStyle}>{item.title}</Text>
                </View>
              );
            }}
            showsVerticalScrollIndicator={false}
            dropdownStyle={styles.dropdownMenuStyle}
          />
        </View>
        <Text style={styles.textBold}>Pilih Bank Transfer</Text>
        <Text style={styles.textBold}>
          Kamu bisa membayar dengan transfer melalui ATM, Internet Banking atau
          Mobile Banking
        </Text>
        <View
          style={{
            marginBottom: 10,
          }}
        >
          {paymentMethods.map((e) => (
            <Button
              key={e.bankName}
              style={styles.paymentMethod}
              onPress={() => {
                handleInputChange('payment_method', e.bankName)
              }}
            >
              <Text style={styles.paymentBox}>{e.bankName}</Text>
              <Text style={styles.paymentText}>{e.bankName} Transfer</Text>
              {formData.payment_method === e.bankName && (
                <Icon
                  style={styles.check}
                  color={'#3D7B3F'}
                  size={20}
                  name={'check'}
                />
              )}
            </Button>
          ))}
        </View>
        <View style={styles.promos}>
          <Text style={styles.textBold}>% Pakai Kode Promo</Text>
          <View style={styles.promosForm}>
            {!formData.promo ? (
              <>
                <TextInput
                  style={styles.promoInput}
                  onChangeText={(val) => setPromoText(val)}
                  placeholder="Tulis promomu disini"
                />
                <Button
                  style={styles.promoButton}
                  onPress={() => {
                    handleInputChange('promo', promoText)
                  }}
                  title={'Terapkan'}
                  color="#3D7B3F"
                />
              </>
            ) : (
              <View style={styles.promoTextWrapper}>
                <Text style={styles.promoText}>{formData.promo}</Text>
                <Pressable
                  onPress={() => {
                    handleInputChange('promo', null)
                  }}
                >
                  <Icon
                    style={styles.check}
                    color={'#880808'}
                    size={30}
                    name={'x'}
                  />
                </Pressable>
              </View>
            )}
          </View>
        </View>
        <Modal visible={datePickerModal.visible}>
          <Pressable onPress={() => setDatePickerModal({ currentInput: null, visible: false })}>
            <Icon name={'x'} size={20} />
          </Pressable>
          <View style={styles.datePickerWrapper}>
            <DateTimePicker
              mode="single"
              timePicker={true}
              minDate={datePickerModal.currentInput === 'end_time' && minDate(formData.start_time)}
              date={formData[datePickerModal.currentInput]}
              onChange={dateTimePickerHandler}
            />
            <Button color="#3D7B3F" title={'Simpan'} onPress={() => setDatePickerModal({ currentInput: null, visible: false })} />
          </View>
        </Modal>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  textBold: {
    fontFamily: 'PoppinsBold',
    fontSize: 16,
    marginBottom: 10,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 0,
    paddingVertical: 10,
    borderWidthBottom: 1,
    borderColorBottom: '#D0D0D0',
  },
  paymentBox: {
    width: '35%',
    textAlign: 'center',
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderColor: '#D0D0D0',
    marginRight: 10,
  },
  check: {
    marginLeft: 'auto',
  },
  promosForm: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  promoInput: {
    borderWidth: 1,
    paddingHorizontal: 10,
    borderColor: '#000',
    width: '70%',
  },
  promoButton: {
    width: '30%',
    borderWidth: 1,
    borderColor: '#3D7B3F',
  },
  promoTextWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  promoText: {
    fontFamily: 'PoppinsBold',
    fontSize: 16,
  },
  inputWrapper: {
    marginBottom: 20,
  },
  inputLabel: {
    fontWeight: 700,
  },
  input: {
    borderWidth: 1,
    marginTop: 10,
    paddingHorizontal: 10,
  },
  inputDate: {
    borderWidth: 1,
    marginTop: 10,
    padding: 10,
  },
  datePickerWrapper: {
    flex: 1,
    height: '100%',
  },
  dropdownButtonStyle: {
    backgroundColor: '#E9ECEF',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    marginTop: 10,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#151E26',
  },
  dropdownButtonArrowStyle: {
    fontSize: 14,
  },
  dropdownButtonIconStyle: {
    fontSize: 14,
    marginRight: 8,
  },
  dropdownMenuStyle: {
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  dropdownItemStyle: {
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: '#151E26',
  },
  dropdownItemIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
});
