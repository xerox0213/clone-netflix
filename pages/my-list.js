import Box from '/components/Box/Box';
import React, { useEffect } from 'react';
import { replaceList } from '../store/redux';
import styles from '/styles/MyList.module.css';
import { useSelector, useDispatch } from 'react-redux';

// On fait du CSR -> Pas besoin d'indexer la page myList elle est unique pour chaque utilisateur
function MyList() {
  const myList = useSelector((state) => state.myList);
  const dispatch = useDispatch();

  // Synchronisation des données venant de mon API avec le state redux pour que notre composant puisse se réactualiser lorsqu'on ajoute ou supprime un élément
  useEffect(() => {
    fetch('/api/database_api/getDataList')
      .then((res) => res.json())
      .then((obj) => {
        dispatch(replaceList(obj.myDataList));
      })
      .catch((error) => console.dir(error));
  }, []);

  return (
    <>
      <section className={styles.myList}>
        <h1 className={styles.title}>Ma liste</h1>
        <div className={styles.grid}>
          {myList.map((infoContentBox) => {
            return (
              <Box
                myListData={myList}
                key={infoContentBox.data.id}
                infoContentBox={infoContentBox}
              />
            );
          })}
        </div>
      </section>
    </>
  );
}

export default MyList;
