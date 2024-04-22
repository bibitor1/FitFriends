import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './app';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { HelmetProvider } from 'react-helmet-async';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  <StrictMode>
    <BrowserRouter>
      <HelmetProvider>
        <Provider store={store}>
          <ToastContainer limit={1} />
          <App />
        </Provider>
      </HelmetProvider>
    </BrowserRouter>
  </StrictMode>,
);
