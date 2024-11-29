import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Modal,
  ActivityIndicator,
} from 'react-native';
import DateTimePicker from 'react-native-ui-datepicker';
import {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {postOrder, selectOrder, setStateByName} from '../../../redux/reducers/order';
import {selectCarDetail} from '../../../redux/reducers/cars';
import CarList from '../../../components/CarList';
import Button from '../../../components/Button';
import Icon from 'react-native-vector-icons/Feather';
import SelectDropdown from 'react-native-select-dropdown';

const paymentMethods = [
  {bankName: 'BCA', account: 12345678, name: 'a. n Super Travel'},
  {bankName: 'MANDIRI', account: 12345678, name: 'a. n Super Travel'},
  {bankName: 'BNI', account: 12345678, name: 'a. n Super Travel'},
];

export default function Step1() {
  const [showDateTime, setShowDateTime] = useState(false);
  const [promoText, setPromoText] = useState(null);
  const {selectedBank, promo, driverType} = useSelector(selectOrder); // Fetch driverType from Redux state
  const [date, setDate] = useState(new Date());
  const {data} = useSelector(selectCarDetail);
  const order = useSelector(selectOrder)
  const dispatch = useDispatch();

  const driverOptions = [
    {title: 'Tanpa Sopir', value: false},
    {title: 'Dengan Sopir', value: true},
  ];

  const handleDriverTypeChange = selectedItem => {
    // Dispatch the selected driver type to Redux state
    dispatch(setStateByName({name: 'driverType', value: selectedItem.value}));
  };

  const handleDateChange = selectedDate => {
    setDate(selectedDate);
    setShowDateTime(false); // Close modal after date is selected
  };

  return (
    <View style={{flex: 1}}>
      <View style={styles.container}>
        <CarList
          image={{uri: data?.img}}
          carName={data?.name}
          passengers={5}
          baggage={4}
          price={data.price}
        />
        <Text style={styles.textBold}>Pilih Opsi Sewa</Text>

        <View style={styles.inputWrapper}>
          <Text style={styles.inputLabel}>Tanggal Ambil</Text>
          <Pressable onPress={() => setShowDateTime(true)}>
            <Text>Select Date</Text>
          </Pressable>
        </View>

        <View style={styles.inputWrapper}>
          <Text style={styles.inputLabel}>Tanggal Kembali</Text>
          <Pressable onPress={() => setShowDateTime(true)}>
            <Text>Select Date</Text>
          </Pressable>
        </View>

        {/* Modal for Date Picker */}
        <Modal
          visible={showDateTime}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowDateTime(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Pilih Tanggal</Text>
              <DateTimePicker
                mode="single"
                date={date}
                onChange={params => handleDateChange(params.date)}
              />
              <Pressable
                onPress={() => setShowDateTime(false)}
                style={styles.modalCloseButton}>
                <Text style={styles.modalCloseText}>Tutup</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        <View style={styles.inputWrapper}>
          <Text style={styles.inputLabel}>Tipe Supir</Text>
          <SelectDropdown
            data={driverOptions}
            onSelect={handleDriverTypeChange} // Set state with the selected item
            defaultButtonText={driverType ? 'Dengan Sopir' : 'Tanpa Sopir'} // Display selected driver type
            renderButton={(selectedItem, isOpened) => {
              return (
                <View style={styles.dropdownButtonStyle}>
                  <Text style={styles.dropdownButtonTxtStyle}>
                    {selectedItem ? selectedItem.title : 'Pilih Tipe Supir'}
                  </Text>
                  <Icon
                    name={isOpened ? 'chevron-up' : 'chevron-down'}
                    style={styles.dropdownButtonArrowStyle}
                  />
                </View>
              );
            }}
            renderItem={(item, index, isSelected) => {
              return (
                <View
                  style={{
                    ...styles.dropdownItemStyle,
                    ...(isSelected && {backgroundColor: '#D2D9DF'}),
                  }}>
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
        <View style={{marginBottom: 10}}>
          {paymentMethods.map(e => (
            <Button
              key={e.bankName}
              style={styles.paymentMethod}
              onPress={() =>
                dispatch(setStateByName({name: 'selectedBank', value: e}))
              }>
              <Text style={styles.paymentBox}>{e.bankName}</Text>
              <Text style={styles.paymentText}>{e.bankName} Transfer</Text>
              {selectedBank?.bankName === e.bankName && (
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
            {!promo ? (
              <>
                <TextInput
                  style={styles.promoInput}
                  onChangeText={val => setPromoText(val)}
                  placeholder="Tulis promomu disini"
                />
                <Button
                  style={styles.promoButton}
                  onPress={() =>
                    dispatch(
                      setStateByName({
                        name: 'promo',
                        value: promoText,
                      }),
                    )
                  }
                  title={'Terapkan'}
                  color="#3D7B3F"
                />
              </>
            ) : (
              <View style={styles.promoTextWrapper}>
                <Text style={styles.promoText}>{promo}</Text>
                <Pressable
                  onPress={() =>
                    dispatch(
                      setStateByName({
                        name: 'promo',
                        value: null,
                      }),
                    )
                  }>
                  <Icon
                    style={styles.check}
                    color={'#880808'}
                    size={30}
                    name={'close'}
                  />
                </Pressable>
              </View>
            )}
          </View>
        </View>
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
    fontWeight: '700',
  },
  input: {
    borderWidth: 1,
    marginTop: 10,
    paddingHorizontal: 10,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Transparent black background
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontFamily: 'PoppinsBold',
    fontSize: 18,
    marginBottom: 20,
  },
  modalCloseButton: {
    marginTop: 20,
    backgroundColor: '#3D7B3F',
    paddingVertical: 10,
    borderRadius: 8,
  },
  modalCloseText: {
    color: '#fff',
    fontSize: 16,
  },
});
