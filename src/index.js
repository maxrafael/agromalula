import React from 'react';
import { StatusBar } from 'react-native';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { Provider as StoreProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import '~/config/ReactotronConfig';

import App from './App';
import { store, persistor } from './store';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#3498db',
    accent: '#f1c40f',
  },
};

export default function Index() {
  return (
    <StoreProvider store={store}>
      <PersistGate persistor={persistor}>
        <StatusBar barStyle="light-content" backgroundColor="#002A54" />
        <PaperProvider theme={theme}>
          <App />
        </PaperProvider>
      </PersistGate>
    </StoreProvider>
  );
}
