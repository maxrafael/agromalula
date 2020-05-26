import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { withNavigationFocus } from 'react-navigation';

import Background from '~/components/Background';
import ButtonAdd from '~/components/ButtonAdd';
import ButtonSync from '~/components/ButtonSync';
import api from '~/services/api';
import useNetInfo from '~/services/netinfo';
import getRealm from '~/services/realm';

import {
  Container,
  Form,
  FormInput,
  List,
  Animal,
  AnimalLeft,
  AnimalInfo,
  AnimalName,
  Footer,
  FooterText,
  FooterButtons,
} from './styles';

function Matrices({ navigation, isFocused }) {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const [loader, setLoader] = useState(true);

  const [startSync, setStartsync] = useState(true);

  const [count, setCount] = useState();
  const [countSync, setCountsync] = useState();

  const [records, setRecords] = useState([]);

  const netStatus = useNetInfo();

  async function loadRecordsOn() {
    const { data } = await api.get(`matrices`, { params: { sync: false } });

    if (data.count > 0) {
      const realm = await getRealm();

      const newData = data.rows.map(matrix => ({
        id: matrix.id,
        name: matrix.name,
        status: matrix.status,
        sync: true,
      }));

      realm.write(() => {
        newData.forEach(element => {
          realm.create('Matrix', element, 'modified');
        });
      });

      data.rows.forEach(element => {
        api.put(`matrices/${element.id}`, { ...element, sync: true });
      });
    }
  }

  useEffect(() => {
    if (netStatus.isInternetReachable) {
      loadRecordsOn();
    }
  }, [netStatus]);

  async function loadRecords() {
    const realm = await getRealm();

    const data = realm
      .objects('Matrix')
      .sorted('name', false)
      .filtered(`name CONTAINS[c] "${search}" AND status != "deleted" `);

    const newData = data.map(matrix => ({
      ...matrix,
    }));

    const newRecords = [...newData];
    setRecords(newRecords);
    setCount(data.length);

    setLoader(false);
    setLoading(false);

    const existsDateSync = realm.objects('Matrix').filtered(`sync == false `);
    setCountsync(existsDateSync.length);

    if (!existsDateSync.length) {
      setStartsync(false);
    }
  }

  useEffect(() => {
    if (isFocused) {
      loadRecords();
    }
  }, [isFocused, search]);

  function handleSearch(searchMatrix) {
    setSearch(searchMatrix);
  }

  async function upMatrices() {
    if (!netStatus.isInternetReachable) {
      Alert.alert('Sem conexão à internet');
      return;
    }

    const realm = await getRealm();
    const dataUp = realm.objects('Matrix').filtered(`sync == false `);

    const newData = dataUp.map(matrix => ({
      id: matrix.id,
      name: matrix.name,
      status: matrix.status,
      sync: true,
    }));

    newData.forEach(async element => {
      const { data } = await api.get('matrices', {
        params: { id: `${element.id}` },
      });

      if (data) {
        api.put(`matrices/${data.id}`, element);
      } else {
        api.post(`matrices`, element);
      }
    });

    const nData = dataUp.map(matrix => ({
      ...matrix,
      sync: true,
    }));

    realm.write(() => {
      nData.forEach(element => {
        realm.create('Matrix', element, 'modified');
      });
    });

    setLoading(true);
  }

  async function handleUp() {
    try {
      await upMatrices();
      loadRecords();
    } catch (err) {
      Alert.alert('Falha na syncronização');
    }
  }

  return (
    <Background>
      <Container>
        <Form>
          <FormInput
            icon="magnify"
            autoCorrect={false}
            autoCapitalize="none"
            placeholder="Buscar"
            returnKeyType="send"
            value={search}
            onChangeText={handleSearch}
          />
        </Form>
        {loader ? (
          <ActivityIndicator size="large" style={{ flex: 1 }} />
        ) : (
          <>
            <List
              data={records}
              keyExtractor={item => String(item.id)}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('MatricesForm', { item });
                  }}
                >
                  <Animal>
                    <AnimalLeft>
                      <Icon
                        name="checkbox-blank-circle"
                        size={16}
                        color={item.status !== 'ativa' ? '#fa3a68' : '#a9d046'}
                      />
                      <AnimalInfo>
                        <AnimalName>{item.name}</AnimalName>
                      </AnimalInfo>
                    </AnimalLeft>
                    <Icon name="chevron-right" size={20} color="#fff" />
                  </Animal>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <AnimalName>Nenhum animal encontrado</AnimalName>
              }
            />
            <Footer>
              <FooterText>
                {count} anima{count > 1 ? 'is' : 'l'}
              </FooterText>
            </Footer>
          </>
        )}

        <FooterButtons>
          <ButtonSync
            iconName="cloud-upload-outline"
            startSync={startSync}
            badgeStatus="error"
            loading={loading}
            onPress={handleUp}
            count={countSync}
          />
          <ButtonAdd
            onPress={() => {
              navigation.navigate('MatricesForm');
            }}
          />
        </FooterButtons>
      </Container>
    </Background>
  );
}

Matrices.navigationOptions = ({ navigation }) => ({
  title: 'MATRIZES',
  headerLeft: () => (
    <TouchableOpacity
      style={{ paddingLeft: 0 }}
      onPress={() => {
        navigation.navigate('Dashboard');
      }}
    >
      <Icon name="chevron-left" size={20} color="#fff" />
    </TouchableOpacity>
  ),
});

Matrices.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  isFocused: PropTypes.bool.isRequired,
};

export default withNavigationFocus(Matrices);
