import PropTypes from 'prop-types';
import React, { useState } from 'react';
import {
  TouchableOpacity,
  Alert,
  Text,
  StyleSheet,
  View,
  Image,
} from 'react-native';
// import ImagePicker from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Background from '~/components/Background';
import DateInput from '~/components/DateInput';
import SelectInput from '~/components/SelectInput';
import api from '~/services/api';
import getRealm from '~/services/realm';

import {
  Container,
  Form,
  FormInput,
  SubmitButton,
  DeleteButton,
} from './styles';

export default function BullsForm({ navigation }) {
  const bull = navigation.getParam('item');

  const [date, setDate] = useState(bull ? bull.birthday : new Date());

  const [name, setName] = useState(bull ? bull.name : '');
  const [status, setStatus] = useState('ativo');

  const [avatar, setAvatar] = useState();

  const placeholderBulls = {
    label: `${bull ? bull.status : 'ativo'}`,
    value: `${bull ? bull.status : 'ativo'}`,
  };

  const optionsBulls = [
    {
      label: 'ativo',
      value: 'ativo',
    },
    {
      label: 'vendido',
      value: 'vendido',
    },
    {
      label: 'abatido',
      value: 'abatido',
    },
  ];

  const newOptions = optionsBulls.filter(item => {
    return item.label !== `${bull ? bull.status : 'ativo'}`;
  });

  function handleSelectChange(newValue) {
    setStatus(newValue);
  }

  async function saveMatrix() {
    const realm = await getRealm();

    const viewBull = realm.objects('Bull').sorted('id', true)[0];
    const highestId = viewBull == null ? 0 : viewBull.id;

    const dataId = bull ? bull.id : highestId + 1;

    const data = {
      id: dataId,
      name,
      birthday: date,
      status,
      sync: false,
    };

    const existsName = realm
      .objects('Bull')
      .filtered(`name == "${data.name}" `);

    if (bull && existsName.length && bull.name !== data.name) {
      Alert.alert('Touro já cadastrado');
      return;
    }

    if (!bull && existsName.length) {
      Alert.alert('Touro já cadastrado');
      return;
    }

    realm.write(() => {
      realm.create('Bull', data, 'modified');
    });

    navigation.navigate('Bulls');
  }

  async function handleSubmit() {
    try {
      await saveMatrix();
    } catch (err) {
      Alert.alert('Falha no cadastro');
    }
  }

  async function deleteBull() {
    const realm = await getRealm();

    const bullSelected = realm.objects('Bull').filtered(`id == ${bull.id} `);

    realm.write(() => {
      realm.delete(bullSelected);
    });

    navigation.navigate('Bulls');
  }

  function handleDelete() {
    Alert.alert(
      'Excluir',
      'Confirma?',
      [
        {
          text: 'Cancelar',
          onPress: () => {},
          style: 'cancel',
        },
        { text: 'Ok', onPress: () => deleteBull() },
      ],
      { cancelable: false }
    );
  }

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
  };

  function imagePickerCallBack(data) {
    if (data.didCancel) {
      return;
    }

    if (data.error) {
      return;
    }

    if (!data.uri) {
      return;
    }

    setAvatar(data);
  }

  async function uploadImages() {
    const data = new FormData();

    data.append('avatar', {
      fileName: avatar.fileName,
      uri: avatar.uri,
      type: avatar.type,
    });

    await api.post('file', data);
  }

  return (
    <Background>
      <Container>
        <Form>
          <FormInput
            value={name}
            onChangeText={setName}
            icon="cow"
            autoCapitalize="characters"
            placeholder="Nome"
          />

          <DateInput date={date} onChange={onChange} />

          <SelectInput
            placeholder={placeholderBulls}
            items={newOptions}
            onChange={handleSelectChange}
          />

          <SubmitButton onPress={handleSubmit}>Salvar</SubmitButton>
          {bull ? (
            <DeleteButton onPress={handleDelete}>Excluir</DeleteButton>
          ) : null}
        </Form>

        {/* <View style={styles.container}>
          <Image
            style={styles.avatar}
            source={{
              uri: avatar
                ? avatar.uri
                : 'https://www.irishtourist.com/wp-content/uploads/2019/04/catimage-no-image.png',
            }}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => ImagePicker.showImagePicker({}, imagePickerCallBack)}
          >
            <Text style={styles.buttonText}>Escolher imagens</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={uploadImages}>
            <Text style={styles.buttonText}>Enviar imagens</Text>
          </TouchableOpacity>
        </View> */}
      </Container>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: 150,
    height: 50,
    borderRadius: 3,
    backgroundColor: '#7159c1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
});

BullsForm.navigationOptions = ({ navigation }) => ({
  title: navigation.getParam('item') ? 'EDIÇÃO DE TOURO' : 'NOVO TOURO',
  headerLeft: () => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('Bulls');
      }}
    >
      <Icon name="chevron-left" size={20} color="#fff" />
    </TouchableOpacity>
  ),
});

BullsForm.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    getParam: PropTypes.func,
  }).isRequired,
};
