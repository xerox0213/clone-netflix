import React from 'react';
import { AiFillCaretDown } from 'react-icons/ai';
import styles from '../Box/Box.module.css';

function InfoButton({ infoTxt }) {
  return (
    <p className={styles.modalInfoTxt}>
      {infoTxt}
      <AiFillCaretDown className={styles.arrowDown} />
    </p>
  );
}

export default InfoButton;
