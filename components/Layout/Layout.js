import Navbar from '../Navbar/Navbar';
import { useRouter } from 'next/router';
import { Roboto } from '@next/font/google';
import Loader from '/components/Loader/Loader';
import { useState, useEffect, useRef } from 'react';

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
});

function Layout({ children }) {
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();
  const refForm = useRef();

  useEffect(() => {
    const handleRouteChange = (url) => {
      if (!url.includes('watch')) {
        setLoading(true);
      }
    };
    const handleRouteComplete = () => {
      setLoading(false);
    };
    router.events.on('routeChangeStart', handleRouteChange);
    router.events.on('routeChangeComplete', handleRouteComplete);
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
      router.events.off('routeChangeComplete', handleRouteComplete);
    };
  }, []);

  const path = router.asPath;
  const regex = /(\/home|\/tv|\/movies|\/my-list|\/search)/;
  return (
    <main className={roboto.className}>
      {regex.test(path) && (
        <Navbar
          refForm={refForm}
          position={path !== '/my-list' ? 'fixed' : 'relative'}
        />
      )}
      {isLoading ? <Loader /> : children}
    </main>
  );
}

export default Layout;
