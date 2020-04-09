import React from 'react';
import { Provider } from 'react-redux';
import { Store } from './redux/store';
import { SnackbarProvider } from 'notistack';

// import './global.css';
import Routes from './routes';

function App() {
  return (
    <Provider store={Store}>
        <SnackbarProvider>
            <Routes />
        </SnackbarProvider>
    </Provider>
  );
}

export default App;
