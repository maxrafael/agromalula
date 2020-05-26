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
  AnimalSmall,
  Footer,
  FooterText,
  FooterButtons,
} from './styles';

function Breeders({ navigation, isFocused }) {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const [loader, setLoader] = useState(true);

  const [startSync, setStartsync] = useState(true);

  const [count, setCount] = useState();
  const [countSync, setCountsync] = useState();

  const [records, setRecords] = useState([]);

  const netStatus = useNetInfo();

  async function loadRecordsOn() {
    const { data } = await api.get(`breeders`, { params: { sync: false } });

    if (data.count > 0) {
      const realm = await getRealm();

      const newData = data.rows.map(breeder => ({
        id: breeder.id,
        name: breeder.name,
        status: breeder.status,
        dose: breeder.dose,
        sync: true,
      }));

      realm.write(() => {
        newData.forEach(element => {
          realm.create('Breeder', element, 'modified');
        });
      });

      data.rows.forEach(element => {
        api.put(`breeders/${element.id}`, { ...element, sync: true });
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
      .objects('Breeder')
      .sorted('name', false)
      .filtered(`name CONTAINS[c] "${search}" AND status != "deleted" `);

    const newData = data.map(breeder => ({
      ...breeder,
    }));

    const newRecords = [...newData];
    setRecords(newRecords);
    setCount(data.length);

    setLoader(false);
    setLoading(false);

    const existsDateSync = realm.objects('Breeder').filtered(`sync == false `);
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

  function handleSearch(searchBreeder) {
    setSearch(searchBreeder);
  }

  async function upBreeders() {
    if (!netStatus.isInternetReachable) {
      Alert.alert('Sem conexão à internet');
      return;
    }

    const realm = await getRealm();
    const dataUp = realm.objects('Breeder').filtered(`sync == false `);

    const newData = dataUp.map(breeder => ({
      id: breeder.id,
      name: breeder.name,
      dose: breeder.dose,
      status: breeder.status,
      sync: true,
    }));

    newData.forEach(async element => {
      const { data } = await api.get('breeders', {
        params: { id: `${element.id}` },
      });

      console.tron.log(data);

      if (data) {
        api.put(`breeders/${data.id}`, element);
      } else {
        api.post(`breeders`, element);
      }
    });

    const nData = dataUp.map(breeder => ({
      ...breeder,
      sync: true,
    }));

    realm.write(() => {
      nData.forEach(element => {
        realm.create('Breeder', element, 'modified');
      });
    });

    setLoading(true);
  }

  async function handleUp() {
    try {
      await upBreeders();
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
                    navigation.navigate('BreedersForm', { item });
                  }}
                >
                  <Animal>
                    <AnimalLeft>
                      <AnimalInfo>
                        <AnimalName>{item.name}</AnimalName>
                        <AnimalSmall>{item.dose} doses</AnimalSmall>
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
              navigation.navigate('BreedersForm');
            }}
          />
        </FooterButtons>
      </Container>
    </Background>
  );
}

Breeders.navigationOptions = ({ navigation }) => ({
  title: 'REPRODUTORES',
  headerLeft: () => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('Dashboard');
      }}
    >
      <Icon name="chevron-left" size={20} color="#fff" />
    </TouchableOpacity>
  ),
});

Breeders.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  isFocused: PropTypes.bool.isRequired,
};

export default withNavigationFocus(Breeders);
