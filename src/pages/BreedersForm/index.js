import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Background from '~/components/Background';
import getRealm from '~/services/realm';

import {
  Container,
  Form,
  FormInput,
  SubmitButton,
  DeleteButton,
} from './styles';

export default function BreedersForm({ navigation }) {
  const breeder = navigation.getParam('item');

  const [name, setName] = useState(breeder ? breeder.name : '');
  const [dose, setDose] = useState(breeder ? breeder.dose : '');

  async function saveBreeder() {
    const realm = await getRealm();

    const viewBreeder = realm.objects('Breeder').sorted('id', true)[0];
    const highestId = viewBreeder == null ? 0 : viewBreeder.id;

    const dataId = breeder ? breeder.id : highestId + 1;

    const data = {
      id: dataId,
      name,
      dose: parseInt(dose, 10),
      status: 'ativo',
      sync: false,
    };

    const existsName = realm
      .objects('Breeder')
      .filtered(`name == "${data.name}" `);

    if (breeder && existsName.length && breeder.name !== data.name) {
      Alert.alert('Reprodutor ja cadastrado');
      return;
    }

    if (!breeder && existsName.length) {
      Alert.alert('Reprodutor ja cadastrado');
      return;
    }

    realm.write(() => {
      realm.create('Breeder', data, 'modified');
    });

    navigation.navigate('Breeders');
  }

  async function handleSubmit() {
    try {
      await saveBreeder();
    } catch (err) {
      Alert.alert('Falha no cadastro');
    }
  }

  async function deleteBreeder() {
    const realm = await getRealm();

    const existsMating = realm
      .objects('Mating')
      .filtered(
        `first_option_id.id == "${breeder.id}" || second_option_id.id == "${breeder.id}" `
      );

    if (existsMating.length) {
      Alert.alert('Reprodutor usado em acasalamentos.');
      return;
    }

    const breederSelected = realm
      .objects('Breeder')
      .filtered(`id == ${breeder.id} `);

    realm.write(() => {
      realm.delete(breederSelected);
    });

    navigation.navigate('Breeders');
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
        { text: 'Ok', onPress: () => deleteBreeder() },
      ],
      { cancelable: false }
    );
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
          <FormInput
            value={`${dose}`}
            onChangeText={setDose}
            icon="eyedropper"
            keyboardType="number-pad"
            placeholder="Doses"
          />

          <SubmitButton onPress={handleSubmit}>Salvar</SubmitButton>
          {breeder ? (
            <DeleteButton onPress={handleDelete}>Excluir</DeleteButton>
          ) : null}
        </Form>
      </Container>
    </Background>
  );
}

BreedersForm.navigationOptions = ({ navigation }) => ({
  title: navigation.getParam('item')
    ? 'EDIÇÃO DE REPRODUTOR'
    : 'NOVO REPRODUTOR',
  headerLeft: () => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('Breeders');
      }}
    >
      <Icon name="chevron-left" size={20} color="#fff" />
    </TouchableOpacity>
  ),
});

BreedersForm.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    getParam: PropTypes.func,
  }).isRequired,
};
