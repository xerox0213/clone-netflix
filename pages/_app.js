import '../styles/globals.css';
import Layout from '../components/Layout/Layout';
import UserContextProvider from '../context/UserContext';
import { Provider } from 'react-redux';
import { store } from '../store/redux';

export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <UserContextProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </UserContextProvider>
    </Provider>
  );
}
