import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Background from '~/components/Background';
import SelectInput from '~/components/SelectInput';
import getRealm from '~/services/realm';

import {
  Container,
  Form,
  FormInput,
  SubmitButton,
  DeleteButton,
} from './styles';

export default function MatricesForm({ navigation }) {
  const matrix = navigation.getParam('item');

  const [name, setName] = useState(matrix ? matrix.name : '');
  const [status, setStatus] = useState('ativa');

  const placeholderMatrices = {
    label: `${matrix ? matrix.status : 'ativa'}`,
    value: `${matrix ? matrix.status : 'ativa'}`,
  };

  const optionsMatrices = [
    {
      label: 'ativa',
      value: 'ativa',
    },
    {
      label: 'vendida',
      value: 'vendida',
    },
    {
      label: 'abatida',
      value: 'abatida',
    },
  ];

  const newOptions = optionsMatrices.filter(item => {
    return item.label !== `${matrix ? matrix.status : 'ativa'}`;
  });

  function handleSelectChange(newValue) {
    setStatus(newValue);
  }

  async function saveMatrix() {
    const realm = await getRealm();

    const viewMatrix = realm.objects('Matrix').sorted('id', true)[0];
    const highestId = viewMatrix == null ? 0 : viewMatrix.id;

    const dataId = matrix ? matrix.id : highestId + 1;

    const data = {
      id: dataId,
      name,
      status,
      sync: false,
    };

    const existsName = realm
      .objects('Matrix')
      .filtered(`name == "${data.name}" `);

    if (matrix && existsName.length && matrix.name !== data.name) {
      Alert.alert('Matriz já cadastrada');
      return;
    }

    if (!matrix && existsName.length) {
      Alert.alert('Matriz já cadastrada');
      return;
    }

    realm.write(() => {
      realm.create('Matrix', data, 'modified');
    });

    navigation.navigate('Matrices');
  }

  async function handleSubmit() {
    try {
      await saveMatrix();
    } catch (err) {
      Alert.alert('Falha no cadastro');
    }
  }

  async function deleteMatrix() {
    const realm = await getRealm();

    const existsMating = realm
      .objects('Mating')
      .filtered(`matrix_id.id == "${matrix.id}" `);

    if (existsMating.length) {
      Alert.alert('Matriz acasalada.');
      return;
    }

    realm.write(() => {
      realm.create(
        'Matrix',
        { id: matrix.id, status: 'deleted', sync: false },
        'modified'
      );
    });

    navigation.navigate('Matrices');
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
        { text: 'Ok', onPress: () => deleteMatrix() },
      ],
      { cancelable: false }
    );
  }

  return (
    <Background>
      <Container>
        <Form>
          <FormInput
            // editable={!matrix}
            value={name}
            onChangeText={setName}
            icon="cow"
            autoCapitalize="characters"
            placeholder="Nome"
          />
          <SelectInput
            placeholder={placeholderMatrices}
            items={newOptions}
            onChange={handleSelectChange}
          />

          <SubmitButton onPress={handleSubmit}>Salvar</SubmitButton>
          {matrix ? (
            <DeleteButton onPress={handleDelete}>Excluir</DeleteButton>
          ) : null}
        </Form>
      </Container>
    </Background>
  );
}

MatricesForm.navigationOptions = ({ navigation }) => ({
  title: navigation.getParam('item') ? 'EDIÇÃO DE MATRIZ' : 'NOVA MATRIZ',
  headerLeft: () => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('Matrices');
      }}
    >
      <Icon name="chevron-left" size={20} color="#fff" />
    </TouchableOpacity>
  ),
});

MatricesForm.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    getParam: PropTypes.func,
  }).isRequired,
};
