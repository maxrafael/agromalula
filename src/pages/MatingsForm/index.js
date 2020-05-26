import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Background from '~/components/Background';
import SelectInput from '~/components/SelectInput';
import getRealm from '~/services/realm';

import { Container, Form, SubmitButton, DeleteButton } from './styles';

export default function MatingsForm({ navigation }) {
  const mating = navigation.getParam('item');

  const [matrix, setMatrix] = useState(mating ? mating.matrix_id.id : '');
  const [first_option, setFirst] = useState(
    mating ? mating.first_option_id.id : ''
  );
  const [second_option, setSecond] = useState(
    mating ? mating.second_option_id.id : ''
  );

  const [matrices, setMatrices] = useState([]);
  const [breeders, setBreeders] = useState([]);

  async function loadRecords() {
    const realm = await getRealm();

    const dataMatrix = realm
      .objects('Matrix')
      .filtered('status == "ativa" ')
      .sorted('name');

    const newDataMatrix = dataMatrix.map(val => ({
      label: val.name,
      value: val.id,
    }));

    const dataBreeder = realm
      .objects('Breeder')
      .filtered('dose > 0 ')
      .sorted('name');

    const newDataBreeder = dataBreeder.map(val => ({
      label: val.name,
      value: val.id,
    }));

    setMatrices(newDataMatrix);
    setBreeders(newDataBreeder);
  }

  useEffect(() => {
    loadRecords();
  }, []);

  const placeholderMatrices = {
    label: `${mating ? mating.matrix_id.name : 'Selecione a Matriz'}`,
    value: `${mating ? mating.matrix_id.id : ''}`,
  };

  const placeholderFirst = {
    label: `${mating ? mating.first_option_id.name : 'Selecione a 1º opção'}`,
    value: `${mating ? mating.first_option_id.id : ''}`,
  };

  const placeholderSecond = {
    label: `${mating ? mating.second_option_id.name : 'Selecione a 2º opção'}`,
    value: `${mating ? mating.second_option_id.id : ''}`,
  };

  const optionsMatrices = matrices.filter(item => {
    return item.label !== `${mating ? mating.matrix_id.name : 'Selecione'}`;
  });

  const optionsBreedersF = breeders.filter(item => {
    return (
      item.label !== `${mating ? mating.first_option_id.name : 'Selecione'}`
    );
  });

  const optionsBreedersS = breeders.filter(item => {
    return (
      item.label !== `${mating ? mating.second_option_id.name : 'Selecione'}`
    );
  });

  async function saveMating() {
    const realm = await getRealm();

    const viewMating = realm.objects('Mating').sorted('id', true)[0];
    const highestId = viewMating == null ? 0 : viewMating.id;

    const dataId = mating ? mating.id : highestId + 1;

    const data = {
      id: dataId,
      date: new Date(),
      sync: false,
    };

    const matrixSelected = realm
      .objects('Matrix')
      .filtered(`id == ${matrix} `)[0];

    const firstSelected = realm
      .objects('Breeder')
      .filtered(`id == ${first_option} `)[0];

    const secondSelected = realm
      .objects('Breeder')
      .filtered(`id == ${second_option} `)[0];

    const existsMating = realm
      .objects('Mating')
      .filtered(`matrix_id.id == "${matrix} AND date = ${new Date()}"`);

    if (mating && existsMating.length && mating.matrix_id.id !== matrix) {
      Alert.alert('Matriz já acasalada');
      return;
    }

    if (!mating && existsMating.length) {
      Alert.alert('Matriz já acasalada');
      return;
    }

    realm.write(() => {
      realm.create(
        'Mating',
        {
          ...data,
          matrix_id: matrixSelected,
          first_option_id: firstSelected,
          second_option_id: secondSelected,
        },
        'modified'
      );
    });

    navigation.navigate('Matings');
  }

  function handleSelectMatrix(newValue) {
    setMatrix(newValue);
  }

  function handleSelectFirst(newValue) {
    setFirst(newValue);
  }

  function handleSelectSecond(newValue) {
    setSecond(newValue);
  }

  async function handleSubmit() {
    try {
      await saveMating();
    } catch (err) {
      Alert.alert('Falha no cadastro');
    }
  }

  async function deleteMating() {
    const realm = await getRealm();

    realm.write(() => {
      realm.create(
        'Mating',
        { id: mating.id, status: 'deleted', sync: false },
        'modified'
      );
    });

    navigation.navigate('Matings');
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
        { text: 'Ok', onPress: () => deleteMating() },
      ],
      { cancelable: false }
    );
  }

  return (
    <Background>
      <Container>
        <Form>
          <SelectInput
            placeholder={placeholderMatrices}
            items={optionsMatrices}
            onChange={handleSelectMatrix}
          />

          <SelectInput
            placeholder={placeholderFirst}
            items={optionsBreedersF}
            onChange={handleSelectFirst}
          />

          <SelectInput
            placeholder={placeholderSecond}
            items={optionsBreedersS}
            onChange={handleSelectSecond}
          />

          <SubmitButton onPress={handleSubmit}>Salvar</SubmitButton>
          {mating ? (
            <DeleteButton onPress={handleDelete}>Excluir</DeleteButton>
          ) : null}
        </Form>
      </Container>
    </Background>
  );
}

MatingsForm.navigationOptions = ({ navigation }) => ({
  title: navigation.getParam('item')
    ? 'EDIÇÃO DE ACASALAMENTO'
    : 'NOVO ACASALAMENTO',
  headerLeft: () => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('Matings');
      }}
    >
      <Icon name="chevron-left" size={20} color="#fff" />
    </TouchableOpacity>
  ),
});

MatingsForm.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    getParam: PropTypes.func,
  }).isRequired,
};
