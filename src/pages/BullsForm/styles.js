import styled from 'styled-components/native';

import Button from '~/components/Button';
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

export const SubmitButton = styled(Button)`
  margin-top: 5px;
`;

export const DeleteButton = styled(Button)`
  margin-top: 15px;
  background: #fa3a68;
`;
