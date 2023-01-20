import { Waypoint } from 'react-waypoint';
import styles from '/styles/Home.module.css';
import useObserver from '../hooks/useObserver';
import HeroHeader from '../components/HeroHeader/HeroHeader';
import SectionSlider from '../components/SectionSlider/SectionSlider';
import LoaderInfinite from '../components/LoaderInfinite/LoaderInfinite';

function Movies(props) {
  const [state, fetchAPI, stateLoader] = useObserver(props.totalPages, 'movie');
  const derivenState = [...props.moviesData, ...state];

  return (
    <>
      <HeroHeader infoContentHeroHeader={props.movieHeroHeaderData} />
      <section className={styles.sectionCategorySliderContainer}>
        {derivenState.map((infoContentSection, index) => {
          return (
            <SectionSlider
              key={index}
              myListData={props.myListData}
              infoContentSection={infoContentSection}
            />
          );
        })}
        <div className={styles.loader}></div>
        <Waypoint onEnter={fetchAPI} bottomOffset='-500px' />
        {stateLoader && <LoaderInfinite />}
      </section>
    </>
  );
}

export default Movies;

export async function getServerSideProps({ req }) {
  try {
    const apiKey = 'c6a3bad00e21476c3f2e75f7e8893c2d';
    const earlyURL = 'https://api.themoviedb.org/3/';

    // Récupère les films et séries ajouté à ma liste depuis le fichier JSON
    const myListDataRequest = await fetch(
      'http://localhost:3000/api/database_api/getDataList',
      {
        method: 'GET',
        headers: {
          cookie: req.cookies.token,
        },
      }
    );
    const { myListData } = await myListDataRequest.json();

    // Récupère un film via un ID pour le hero header
    const movieHeroHeaderRequest = await fetch(
      `${earlyURL}movie/497698?api_key=${apiKey}&language=fr-FR`
    );
    const movieHeroHeaderData = await movieHeroHeaderRequest.json();

    // Tableau qui accueillera l'ensemble de nos URLS pour effectuer toutes les requêtes
    const URLS = [];
    // Ajoute une URL dans le tableau URLS en incrémentant le numéro de la page
    for (let nPage = 1; nPage < 6; nPage++) {
      const url = `${earlyURL}discover/movie?api_key=${apiKey}&language=fr-FR&sort_by=popularity.desc&include_adult=false&include_video=false&page=${nPage}&year=2021&with_watch_monetization_types=flatrate`;
      URLS.push(url);
    }
    // Requêtes pour récupèrer nos films
    const moviesRequest = await Promise.all([
      fetch(URLS[0]),
      fetch(URLS[1]),
      fetch(URLS[2]),
      fetch(URLS[3]),
      fetch(URLS[4]),
    ]);

    let moviesData = await Promise.all([
      moviesRequest[0].json(),
      moviesRequest[1].json(),
      moviesRequest[2].json(),
      moviesRequest[3].json(),
      moviesRequest[4].json(),
    ]);

    const totalPages = moviesData[0].total_pages;

    // Liste de titre pour chaque section
    const titleSection = [
      'Appréciés sur Nasflix',
      'Tendances actuelles',
      'Films US palpitantes',
      'Pour tous les goûts',
      'Histoire sombre',
    ];

    moviesData = moviesData.map((movie, index) => {
      return {
        titleSection: titleSection[index],
        content: movie.results.map((elem) => {
          return {
            mediaType: 'movie',
            data: {
              id: elem.id,
              vote_average: elem.vote_average,
              genre_ids: elem.genre_ids,
              backdrop_path: elem.backdrop_path,
            },
          };
        }),
      };
    });

    moviesData.forEach((dataSection) => {
      dataSection.content = dataSection.content.filter((dataMovie) => {
        return dataMovie.data.backdrop_path;
      });
    });

    return {
      props: {
        movieHeroHeaderData: { mediaType: 'movie', data: movieHeroHeaderData },
        moviesData,
        myListData,
        totalPages,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
}
