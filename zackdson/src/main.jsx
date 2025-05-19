// import React from 'react'
// import ReactDOM from 'react-dom/client'
// import App from './App.jsx'
// import store from './store';
// import { Provider } from 'react-redux';
// import './index.css'

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <Provider store={store}>
//     <App />
//   </Provider>
// )
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import store, { persistor } from './store';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
);
