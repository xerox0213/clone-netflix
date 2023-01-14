import Link from 'next/link';
import Image from 'next/image';
import { v4 as uuidv4 } from 'uuid';
import { genres } from '../../genres';
import { useDispatch } from 'react-redux';
import styles from '../Box/Box.module.css';
import { UserContext } from '../../context/UserContext';
import InfoButton from '../InfoButton/InfoButton';
import { IoPlay, IoAdd, IoCheckmark } from 'react-icons/io5';
import { addElement, deleteElement } from '../../store/redux';
import { useState, useEffect, useRef, memo, useContext } from 'react';

function ModalBox({ infoContentModalBox, isLocked, myListData }) {
  const { currentUser } = useContext(UserContext);

  const [isAddToMyList, setIsAddToMyList] = useState(() => {
    const index = myListData.findIndex(
      (elem) => elem.data.id === infoContentModalBox.data.id
    );
    if (index === -1) {
      return false;
    } else {
      return true;
    }
  });

  const dispatch = useDispatch();
  const ref = useRef();

  useEffect(() => {
    const modalBox = ref.current;

    const lockTransition = (e) => {
      e.stopPropagation();
      isLocked.current = true;
    };
    const unlockTransition = (e) => {
      e.stopPropagation();
      isLocked.current = false;
    };

    modalBox.addEventListener('transitionstart', lockTransition);
    modalBox.addEventListener('transitionend', unlockTransition);

    return () => {
      modalBox.removeEventListener('transitionstart', lockTransition);
      modalBox.removeEventListener('transitionend', unlockTransition);
    };
  }, []);

  const handleClick = async () => {
    if (!isAddToMyList) {
      try {
        const myInit = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            uid: currentUser.uid,
            obj: infoContentModalBox,
          }),
        };
        await fetch(
          'https://clone-netflix-lovat-tau.vercel.app/api/database_api/addDataList',
          myInit
        );
        dispatch(addElement(infoContentModalBox));
        setIsAddToMyList(true);
      } catch (error) {
        console.log('ERROR MODAL BOX ADD');
      }
    } else {
      try {
        const myInit = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            uid: currentUser.uid,
            obj: infoContentModalBox,
          }),
        };
        await fetch(
          'https://clone-netflix-lovat-tau.vercel.app/api/database_api/removeDataList',
          myInit
        );
        dispatch(deleteElement(infoContentModalBox.data.id));
        setIsAddToMyList(false);
      } catch (error) {
        console.log('ERROR MODAL BOX REMOVE');
      }
    }
  };

  const url = `https://image.tmdb.org/t/p/w500${infoContentModalBox.data.backdrop_path}`;

  return (
    <div ref={ref} className={styles.modalBox}>
      <div className={styles.headerModalBox}>
        <Image src={url} alt='image' width={500} height={281} />
      </div>
      <div className={styles.contentModalBox}>
        <div className={styles.btnsContainerModalBox}>
          <Link
            className={styles.playBtn}
            href={{
              pathname: `/watch/${infoContentModalBox.data.id}`,
              query: { mediaType: infoContentModalBox.mediaType },
            }}
          >
            <IoPlay />
            <InfoButton infoTxt='Lecture' />
          </Link>
          <button onClick={handleClick} className={styles.addListBtn}>
            {isAddToMyList ? <IoCheckmark /> : <IoAdd />}
            <InfoButton
              infoTxt={
                isAddToMyList ? 'Suppprimer de Ma liste' : 'Ajouter à Ma liste'
              }
            />
          </button>
        </div>
        <p className={styles.recommendationTxt}>
          Recommandé à {infoContentModalBox.data.vote_average * 10} %
        </p>
        <ul className={styles.genresList}>
          {infoContentModalBox.data.genre_ids.map((genreId) => {
            const genre = genres.find((infoGenre) => infoGenre.id === genreId);
            return (
              <li key={uuidv4()}>
                <span className={styles.dotList}></span>
                {genre.name}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default memo(ModalBox);
