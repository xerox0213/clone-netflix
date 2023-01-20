import '../styles/globals.css';
import Layout from '../components/Layout/Layout';
import { Provider } from 'react-redux';
import { store } from '../store/redux';

export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  );
}
