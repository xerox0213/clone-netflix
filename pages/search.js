import React from 'react';
import Box from '/components/Box/Box';
import styles from '/styles/Search.module.css';
import { getData } from './api/database_api/getDataList';

function Search(props) {
  if (props.searchDataFiltered.length === 0) {
    return (
      <section className={styles.searchSection}>
        <h1>
          Aucun résultat pour votre recherche. Essayez avec d'autres mot clefs.
        </h1>
      </section>
    );
  }
  return (
    <section className={styles.searchSection}>
      <div className={styles.grid}>
        {props.searchDataFiltered.map((infoContentBox) => {
          return (
            <Box
              myListData={props.myListData}
              key={infoContentBox.data.id}
              infoContentBox={infoContentBox}
            />
          );
        })}
      </div>
    </section>
  );
}

export default Search;

export async function getServerSideProps({ req, query }) {
  try {
    // Objet (pas objet JS) de la recherche faites par l'utilisateur
    const querySearch = query.search;

    // Récupère les films et séries ajouté à ma liste dans Firebase
    const uid = req.cookies.token;
    const myListData = await getData(uid);

    // Récupère les films / séries en fonction d'une recherche
    const searchRequest = await fetch(
      `https://api.themoviedb.org/3/search/multi?api_key=c6a3bad00e21476c3f2e75f7e8893c2d&language=en-US&query=${querySearch}&page=1&include_adult=false`
    );
    const searchData = await searchRequest.json();

    // Garde uniquement les éléments de la liste qui ont un media_type (tv/movie) ET qui possèdent un backdrop_path
    let searchDataFiltered = searchData.results.filter(
      (elem) =>
        (elem.media_type === 'movie' || elem.media_type === 'tv') &&
        elem.backdrop_path !== null
    );

    searchDataFiltered = searchDataFiltered.map((elem) => {
      return {
        mediaType: elem.media_type,
        data: {
          id: elem.id,
          genre_ids: elem.genre_ids,
          backdrop_path: elem.backdrop_path,
          vote_average: elem.vote_average,
        },
      };
    });

    return {
      props: {
        searchDataFiltered,
        myListData,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
}
