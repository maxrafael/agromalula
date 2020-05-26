import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { Container } from './styles';

export default function Button({ ...rest }) {
  return (
    <Container {...rest}>
      <Icon name="plus-circle-outline" size={28} color="#FFF" />
    </Container>
  );
}
