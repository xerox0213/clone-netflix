import React from 'react';
import Image from 'next/image';
import Logo from '/public/assets/big-logo.png';
import Link from 'next/link';
import styles from '/styles/404.module.css';

function Error() {
  return (
    <div className={styles.error}>
      <Image className={styles.logo} src={Logo} />
      <h1 className={styles.title}>Erreur 404</h1>
      <Link className={styles.link} href='/'>
        Revenir à l'accueil
      </Link>
    </div>
  );
}

export default Error;
