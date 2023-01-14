import Link from 'next/link';
import Image from 'next/image';
import { useContext } from 'react';
import { useRouter } from 'next/router';
import styles from './Navbar.module.css';
import React, { useEffect, useState } from 'react';
import { UserContext } from '../../context/UserContext';
import SmallLogo from '../../public/assets/small-logo.png';
import { IoSearchOutline, IoLogOutOutline } from 'react-icons/io5';
import Cookies from 'js-cookie';
import { useDispatch } from 'react-redux';
import { replaceList } from '../../store/redux';

function Navbar({ position, refForm }) {
  const [scrollNavbar, setScrollNavbar] = useState(false);
  const [focus, setFocus] = useState(false);
  const { disconnectUser } = useContext(UserContext);
  const router = useRouter();
  const dispatch = useDispatch();

  const pathCurrentPage = router.asPath;
  const redirectionPage = router.push;

  useEffect(() => {
    const scrollTrigger = () => {
      const scrollY = window.scrollY;
      if (scrollY >= 10) setScrollNavbar(true);
      else setScrollNavbar(false);
    };
    document.addEventListener('scroll', scrollTrigger);

    return () => {
      document.removeEventListener('scroll', scrollTrigger);
    };
  }, []);

  const signOut = async () => {
    try {
      await disconnectUser();
      dispatch(replaceList([]));
    } catch (error) {
      redirectionPage('/404');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const form = e.target;
    const inputSearch = form.children[1];
    const search = inputSearch.value;
    if (search !== '') {
      redirectionPage({
        pathname: '/search',
        query: { search },
      });
    } else {
      return;
    }
    form.reset();
    inputSearch.blur();
  };

  const handleBlur = (e) => {
    const inputSearch = e.target;
    const search = inputSearch.value;
    if (search !== '') {
      inputSearch.focus();
    } else {
      setFocus(false);
    }
  };

  const handleFocus = () => {
    setFocus(true);
  };

  const handleLogOut = async () => {
    try {
      await signOut();
      Cookies.remove('token');
    } catch (error) {
      console.dir(error);
    }
  };

  return (
    <nav
      className={
        scrollNavbar ? `${styles.navbar} ${styles.activeScroll}` : styles.navbar
      }
      style={{ position }}
    >
      <div className={styles.leftContainerNavbar}>
        <Image className={styles.logo} src={SmallLogo} alt='logo du service' />
        <div className={styles.linksNavbarContainer}>
          <a style={{ cursor: 'pointer' }}>Parcourir</a>
          <div className={styles.linksNavbar}>
            <Link
              className={pathCurrentPage === '/home' && styles.active}
              href='/home'
            >
              Accueil
            </Link>
            <Link
              className={pathCurrentPage === '/tv' && styles.active}
              href='/tv'
            >
              Séries
            </Link>
            <Link
              className={pathCurrentPage === '/movies' && styles.active}
              href='/movies'
            >
              Films
            </Link>
            <Link
              className={pathCurrentPage === '/my-list' && styles.active}
              href='/my-list'
            >
              Ma liste
            </Link>
          </div>
        </div>
      </div>

      <div className={styles.btnsNavbar}>
        <form
          autoComplete='off'
          ref={refForm}
          onSubmit={handleSearch}
          className={
            focus ? `${styles.active} ${styles.formSearch}` : styles.formSearch
          }
        >
          <label htmlFor='search' className={styles.labelSearch}>
            <IoSearchOutline />
          </label>
          <input
            onFocus={handleFocus}
            onBlur={handleBlur}
            type='text'
            id='search'
            className={
              focus
                ? `${styles.active} ${styles.inputSearch}`
                : styles.inputSearch
            }
            placeholder='Films ou séries'
          />
        </form>
        <button onClick={handleLogOut}>
          <IoLogOutOutline />
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
