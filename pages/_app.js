import '../styles/globals.css';
import { Provider } from 'react-redux';
import { store } from '../store/redux';
import Layout from '../components/Layout/Layout';

export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  );
}
