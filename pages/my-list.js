import Box from '/components/Box/Box';
import { useRouter } from 'next/router';
import { replaceList } from '../store/redux';
import styles from '/styles/MyList.module.css';
import React, { useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { useSelector, useDispatch } from 'react-redux';

// On fait du CSR -> Pas besoin d'indexer la page myList elle est personnelle à chaque user
function MyList() {
  const { currentUser } = useContext(UserContext);
  const router = useRouter();
  const myList = useSelector((state) => state.myList);
  const dispatch = useDispatch();

  if (!currentUser) {
    router.push('/signIn');
  }
  // Synchronisation des données venant de mon API avec le state redux pour avoir un qui se réactualise lorsqu'on ajoute ou supprime un élément
  useEffect(() => {
    fetch('http://localhost:3000/api/database_api/getDataList')
      .then((res) => res.json())
      .then((obj) => dispatch(replaceList(obj.myListData)))
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
