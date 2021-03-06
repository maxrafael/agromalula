import styled from 'styled-components/native';

export const Container = styled.View`
  padding: 0 15px;
  height: 46px;
  background: #fff;
  border-radius: 4px;

  flex-direction: row;
  align-items: center;
`;

export const TInput = styled.TextInput.attrs({
  placeholderTextColor: '#3D3C3C',
})`
  flex: 1;
  font-size: 15px;
  margin-left: 10px;
  color: #3d3c3c;
`;
