import React from 'react';
import { Provider } from 'react-redux';
import { Store } from './redux/store';
import Routes from './routes';
import './global.css';
import { SnackbarProvider } from 'notistack';

function App() {
  return (
    <Provider store={Store}>
        <Routes />
    </Provider>
  );
}

export default App;
