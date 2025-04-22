import React from 'react';
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { Provider, useSelector } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import ReactDOM from 'react-dom/client';
import store from 'StoreFarm/index';
import { RootState } from 'StoreFarm/reducer';
import Routes from './Router';

import 'react-toastify/dist/ReactToastify.css';
import './style/index.css';

const App = () => {
  const isConnected = useSelector(
    (state: RootState) => state.connected.isConnected
  );

  const errorHandler = React.useCallback((error: any) => {
    const { message, code, response } = error;

    /**
     * @TODO
     */
  }, []);

  const { current: queryClient } = React.useRef(
    new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
          retry: true,
        },
      },
      queryCache: new QueryCache({
        onError: errorHandler,
      }),
      mutationCache: new MutationCache({
        onError: errorHandler,
      }),
    })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes />
      </BrowserRouter>
      <ToastContainer
        pauseOnFocusLoss={false}
        pauseOnHover={false}
        position="top-right"
      />
    </QueryClientProvider>
  );
};

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
// serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
