import { differenceInMonths } from 'date-fns';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { withNavigationFocus } from 'react-navigation';

import Background from '~/components/Background';
import ButtonAdd from '~/components/ButtonAdd';
import ButtonSync from '~/components/ButtonSync';
import api from '~/services/api';
// import useNetInfo from '~/services/netinfo';
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
  // Loading,
} from './styles';

function Bulls({ navigation, isFocused }) {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [loader, setLoader] = useState(true);

  const [startSync, setStartsync] = useState(true);

  const [count, setCount] = useState();
  const [countSync, setCountsync] = useState();

  const [records, setRecords] = useState([]);

  // const netStatus = useNetInfo();

  async function loadRecordsOn() {
    // if (!netStatus.isInternetReachable) {
    //   Alert.alert('Falha na conexão');
    //   return;
    // }

    const { data } = await api.get(`bulls`, { params: { sync: false } });

    if (data.count > 0) {
      const realm = await getRealm();

      const newData = data.rows.map(bull => ({
        ...bull,
        sync: true,
      }));

      realm.write(() => {
        newData.forEach(element => {
          realm.create('Bull', element, 'modified');
        });
      });

      data.rows.forEach(element => {
        api.put(`bulls/${element.id}`, { ...element, sync: true });
      });
    }
  }

  // useEffect(() => {
  //   if (netStatus.isInternetReachable) {
  //     loadRecordsOn();
  //   }
  // }, [netStatus]);

  async function loadRecords(shouldRefresh = false) {
    const realm = await getRealm();

    const data = realm
      .objects('Bull')
      .sorted('name', false)
      .filtered(`status != "deleted" AND name CONTAINS[c] "${search}" `);

    const newData = data.map(bull => ({
      ...bull,
      birthdayMonths: `${differenceInMonths(new Date(), bull.birthday)} ${
        differenceInMonths(new Date(), bull.birthday) > 1 ? 'Meses' : 'Mês'
      } `,
    }));

    // const newRecords = [...newData];
    setRecords(shouldRefresh ? newData : [...records, ...newData]);
    setCount(data.length);

    setLoader(false);
    setLoading(false);

    const existsDateSync = realm.objects('Bull').filtered(`sync == false `);
    setCountsync(existsDateSync.length);

    if (!existsDateSync.length) {
      setStartsync(false);
    }
  }

  useEffect(() => {
    if (isFocused) {
      loadRecords(true);
    }
  }, [isFocused, search]);

  function handleSearch(searchBull) {
    setSearch(searchBull);
  }

  async function upBulls() {
    // if (!netStatus.isInternetReachable) {
    //   Alert.alert('Sem conexão à internet');
    //   return;
    // }

    const realm = await getRealm();
    const dataUp = realm.objects('Bull').filtered(`sync == false`);

    const newData = dataUp.map(bull => ({
      ...bull,
      sync: true,
    }));

    newData.forEach(async element => {
      const { data } = await api.get('bulls', {
        params: { id: `${element.id}` },
      });

      if (data) {
        api.put(`bulls/${data.id}`, element);
      } else {
        api.post(`bulls`, element);
      }
    });

    const nData = dataUp.map(mating => ({
      ...mating,
      sync: true,
    }));

    realm.write(() => {
      nData.forEach(element => {
        realm.create('Bull', element, 'modified');
      });
    });

    setLoading(true);
  }

  async function handleUp() {
    try {
      await upBulls();
      loadRecords();
    } catch (err) {
      Alert.alert('Falha na syncronização');
    }
  }

  async function refreshList() {
    setRefreshing(true);

    await loadRecordsOn();
    await loadRecords(true);

    setRefreshing(false);
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
              onRefresh={refreshList}
              refreshing={refreshing}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('BullsForm', { item });
                  }}
                >
                  <Animal>
                    <AnimalLeft>
                      <Icon
                        name="checkbox-blank-circle"
                        size={16}
                        color={item.status !== 'ativo' ? '#fa3a68' : '#a9d046'}
                      />
                      <AnimalInfo>
                        <AnimalName>{item.name}</AnimalName>
                        <AnimalSmall>{item.birthdayMonths}</AnimalSmall>
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
              navigation.navigate('BullsForm');
            }}
          />
        </FooterButtons>
      </Container>
    </Background>
  );
}

Bulls.navigationOptions = ({ navigation }) => ({
  title: 'TOUROS',
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

Bulls.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  isFocused: PropTypes.bool.isRequired,
};

export default withNavigationFocus(Bulls);
