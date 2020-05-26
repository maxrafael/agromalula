import { RectButton } from 'react-native-gesture-handler';
import styled from 'styled-components/native';

export const Container = styled.SafeAreaView`
  flex: 1;
`;

export const Menu = styled.FlatList.attrs({
  showsVerticalScrollIndicator: false,
  numColumns: 2,
})`
  margin-top: 60px;
  padding: 0 20px;
`;

export const ItemsMenu = styled(RectButton)`
  background: rgba(0, 0, 0, 0.1);
  border-radius: 6px;
  padding: 15px;
  flex: 1;

  align-items: center;
  margin: 0 10px 20px;
`;

export const ItemsMenuIcon = styled.Image`
  width: 86px;
  height: 86px;
  border-radius: 25px;
`;

export const ItemsMenuTitle = styled.Text`
  margin-top: 15px;
  font-size: 14px;
  font-weight: bold;
  color: #a9d046;
  text-align: center;
`;
