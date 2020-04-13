import React from 'react';
import { Provider } from 'react-redux';
import { Store } from './redux/store';
import Routes from './routes';
import { SnackbarProvider } from 'notistack';

// import './global.css';

function App() {
  return (
    <Provider store={Store}>
        <Routes />
    </Provider>
  );
}

export default App;
