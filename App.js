// App.js (create at project root)
import React from 'react';
import { Provider } from 'react-redux';
import { store } from './src/features/redux/store';
import RootNavigator from './src/features/navigation/RootNavigator';

export default function App() {
  return (
    <Provider store={store}>
      <RootNavigator />
    </Provider>
  );
}
