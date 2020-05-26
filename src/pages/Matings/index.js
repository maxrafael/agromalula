import { format } from 'date-fns';
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

import { AnimalSmall } from '../Breeders/styles';
import {
  Container,
  Form,
  FormInput,
  List,
  Animal,
  AnimalLeft,
  AnimalInfo,
  AnimalName,
  TOption,
  TDate,
  Footer,
  FooterText,
  FooterButtons,
} from './styles';

function Matings({ navigation, isFocused }) {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const [loader, setLoader] = useState(true);

  const [startSync, setStartsync] = useState(true);

  const [count, setCount] = useState();
  const [countSync, setCountsync] = useState();

  const [records, setRecords] = useState([]);

  const netStatus = useNetInfo();

  async function loadRecordsOn() {
    const { data } = await api.get(`matings`, { params: { sync: false } });

    if (data.count > 0) {
      const realm = await getRealm();

      const newData = data.rows.map(mating => ({
        ...mating,
        sync: true,
      }));

      realm.write(() => {
        newData.forEach(element => {
          const matrixSelected = realm
            .objects('Matrix')
            .filtered(`id == ${element.matrix_id} `)[0];

          const firstSelected = realm
            .objects('Breeder')
            .filtered(`id == ${element.first_option_id} `)[0];

          const secondSelected = realm
            .objects('Breeder')
            .filtered(`id == ${element.second_option_id} `)[0];
          realm.create(
            'Mating',
            {
              ...element,
              matrix_id: matrixSelected,
              first_option_id: firstSelected,
              second_option_id: secondSelected,
            },
            'modified'
          );
        });
      });

      data.rows.forEach(element => {
        api.put(`matings/${element.id}`, { ...element, sync: true });
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
      .objects('Mating')
      .sorted('matrix_id.name')
      .filtered(
        `status != "deleted" AND (matrix_id.name CONTAINS[c] "${search}" || first_option_id.name CONTAINS[c] "${search}" || second_option_id.name CONTAINS[c] "${search}") `
      );

    const newData = data.map(mating => ({
      ...mating,
      date: format(mating.date, 'dd/MM/yyyy'),
    }));

    const newRecords = [...newData];
    setRecords(newRecords);
    setCount(data.length);

    setLoader(false);
    setLoading(false);

    const existsDateSync = realm.objects('Mating').filtered(`sync == false `);
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

  function handleSearch(searchMating) {
    setSearch(searchMating);
  }

  async function upMatings() {
    if (!netStatus.isInternetReachable) {
      Alert.alert('Sem conexão à internet');
      return;
    }

    const realm = await getRealm();
    const dataUp = realm.objects('Mating').filtered(`sync == false`);

    const newData = dataUp.map(mating => ({
      ...mating,
      matrix_id: mating.matrix_id.id,
      first_option_id: mating.first_option_id.id,
      second_option_id: mating.second_option_id.id,
      sync: true,
    }));

    newData.forEach(async element => {
      const { data } = await api.get('matings', {
        params: { id: `${element.id}` },
      });

      if (data) {
        api.put(`matings/${data.id}`, element);
      } else {
        api.post(`matings`, element);
      }
    });

    const nData = dataUp.map(mating => ({
      ...mating,
      sync: true,
    }));

    realm.write(() => {
      nData.forEach(element => {
        realm.create('Mating', element, 'modified');
      });
    });

    setLoading(true);
  }

  async function handleUp() {
    try {
      await upMatings();
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
                    navigation.navigate('MatingsForm', { item });
                  }}
                >
                  <Animal>
                    <AnimalLeft>
                      <AnimalInfo>
                        <AnimalName>{item.matrix_id.name}</AnimalName>
                        <AnimalSmall>
                          1º OPÇÃO:{' '}
                          <TOption>{item.first_option_id.name}</TOption>
                        </AnimalSmall>
                        <AnimalSmall>
                          2º OPÇÃO:{' '}
                          <TOption>{item.second_option_id.name}</TOption>
                        </AnimalSmall>
                        <AnimalSmall>
                          DATA: <TDate>{item.date}</TDate>
                        </AnimalSmall>
                      </AnimalInfo>
                    </AnimalLeft>
                    <Icon name="chevron-right" size={20} color="#fff" />
                  </Animal>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <AnimalName>Nenhum acasalamento encontrado</AnimalName>
              }
            />
            <Footer>
              <FooterText>
                {count} acasalament{count > 1 ? 'os' : 'o'}
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
              navigation.navigate('MatingsForm');
            }}
          />
        </FooterButtons>
      </Container>
    </Background>
  );
}

Matings.navigationOptions = ({ navigation }) => ({
  title: 'ACASALAMENTOS',
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

Matings.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  isFocused: PropTypes.bool.isRequired,
};

export default withNavigationFocus(Matings);
