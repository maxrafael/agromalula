import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { Badge } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { Container } from './styles';

export default function Button({
  loading,
  iconName,
  badgeStatus,
  count,
  ...rest
}) {
  return (
    <Container {...rest}>
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <View style={styles.row}>
          <Icon name={iconName} size={28} color="#fff" />
          {count > 0 ? (
            <Badge
              value={count}
              status={badgeStatus}
              containerStyle={styles.badgeStyle}
            />
          ) : (
            <></>
          )}
        </View>
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 18,
  },
  row: {
    flexDirection: 'row',
  },
  badgeStyle: {
    position: 'absolute',
    top: -8,
    right: -8,
  },
});
