import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { ListItem } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Background from '~/components/Background';
import ButtonAdd from '~/components/ButtonAdd';

import { Container, Form, FormInput, List } from './styles';

export default function Matings({ navigation }) {
  const [search, setSearch] = useState('');

  const list = [
    {
      name: 'Amy Farha',
      avatar_url:
        'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
      subtitle: 'Vice President',
    },
    {
      name: 'Chris Jackson',
      avatar_url:
        'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
      subtitle: 'Vice Chairman',
    },
  ];

  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item }) => (
    <ListItem
      title={item.name}
      rightTitle="ativa"
      subtitle={item.subtitle}
      leftAvatar={{ source: { uri: item.avatar_url } }}
      bottomDivider
      chevron
      containerStyle={{ backgroundColor: 'transparent' }}
      titleStyle={{ color: '#fff' }}
      subtitleStyle={{ color: '#fff' }}
    />
  );

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
            onChangeText={setSearch}
          />
        </Form>
        <List
          keyExtractor={this.keyExtractor}
          data={list}
          renderItem={this.renderItem}
        />
        <ButtonAdd
          onPress={() => {
            navigation.navigate('MatingForm');
          }}
        />
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
