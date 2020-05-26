import PropTypes from 'prop-types';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { withNavigationFocus } from 'react-navigation';

import iconBreeders from '~/assets/breeders.png';
import iconBulls from '~/assets/bulls.png';
import iconMatings from '~/assets/matings.png';
import iconMatrices from '~/assets/matrices.png';
import Background from '~/components/Background';

import {
  Container,
  Menu,
  ItemsMenu,
  ItemsMenuIcon,
  ItemsMenuTitle,
} from './styles';

const optionsMenu = [
  {
    name: 'MATRIZES',
    icon: iconMatrices,
    nav: 'Matrices',
  },
  {
    name: 'REPRODUTORES',
    icon: iconBreeders,
    nav: 'Breeders',
  },
  {
    name: 'ACASALAMENTOS',
    icon: iconMatings,
    nav: 'Matings',
  },
  {
    name: 'TOUROS',
    icon: iconBulls,
    nav: 'Bulls',
  },
];

function Dashboard({ navigation }) {
  return (
    <Background>
      <Container>
        <Menu
          data={optionsMenu}
          keyExtractor={menu => String(menu.name)}
          renderItem={({ item: menu }) => (
            <ItemsMenu onPress={() => navigation.navigate(menu.nav)}>
              <ItemsMenuIcon source={menu.icon} />
              <ItemsMenuTitle>{menu.name}</ItemsMenuTitle>
            </ItemsMenu>
          )}
        />
      </Container>
    </Background>
  );
}

const tabBarIcon = ({ tintColor }) => (
  <Icon name="view-dashboard-outline" size={20} color={tintColor} />
);

Dashboard.navigationOptions = {
  headerShown: false,
  tabBarLabel: 'Home',
  tabBarIcon,
};

tabBarIcon.propTypes = {
  tintColor: PropTypes.string.isRequired,
};

Dashboard.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

export default withNavigationFocus(Dashboard);
