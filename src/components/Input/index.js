import PropTypes from 'prop-types';
import React, { forwardRef } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { Container, TInput } from './styles';

function Input({ style, icon, ...rest }, ref) {
  return (
    <Container style={style}>
      {icon && <Icon name={icon} size={20} color="#3D3C3C" />}
      <TInput {...rest} ref={ref} />
    </Container>
  );
}

Input.propTypes = {
  icon: PropTypes.string,
  style: PropTypes.oneOf([PropTypes.object, PropTypes.array]),
};

Input.defaultProps = {
  icon: null,
  style: {},
};

export default forwardRef(Input);
