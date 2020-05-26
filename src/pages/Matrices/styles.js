import styled from 'styled-components/native';

import Input from '~/components/Input';

export const Container = styled.SafeAreaView`
  flex: 1;
`;

export const Form = styled.View`
  align-self: stretch;
  margin-top: 50px;
  padding: 0 15px;
`;

export const FormInput = styled(Input)`
  margin-bottom: 10px;
`;

export const List = styled.FlatList.attrs({
  showsVerticalScrollIndicator: false,
})`
  margin-top: 10px;
  flex-direction: column;
  padding: 0 15px;
`;

export const Animal = styled.View`
  margin-bottom: 5px;
  padding: 10px;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const AnimalLeft = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const AnimalAvatar = styled.Image`
  width: 16px;
  height: 16px;
  border-radius: 25px;
`;

export const AnimalInfo = styled.View`
  margin-left: 15px;
`;

export const AnimalName = styled.Text`
  font-weight: bold;
  font-size: 14px;
  color: #fff;
  text-align: left;
`;

export const AnimalSmall = styled.Text`
  color: #999;
  font-size: 13px;
  margin-top: 4px;
`;

export const Footer = styled.View`
  align-self: stretch;
  margin-top: 10px;
  margin-bottom: 10px;
  padding: 0 15px;
`;

export const FooterText = styled.Text`
  border-radius: 4px;
  color: #fff;
  font-weight: bold;
  padding: 10px;
  background: rgba(0, 0, 0, 0.1);
`;

export const FooterButtons = styled.View`
  display: flex;
  flex-direction: row;
  padding: 0 30% 0 30%;
  justify-content: space-between;
`;
