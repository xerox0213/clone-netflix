import { Waypoint } from 'react-waypoint';
import styles from '/styles/Home.module.css';
import useObserver from '../hooks/useObserver';
import HeroHeader from '../components/HeroHeader/HeroHeader';
import SectionSlider from '../components/SectionSlider/SectionSlider';
import LoaderInfinite from '/components/LoaderInfinite/LoaderInfinite';
import { getData } from './api/database_api/getDataList';

function Tv(props) {
  const [state, fetchAPI, stateLoader] = useObserver(props.totalPages, 'tv');
  const derivenState = [...props.tvData, ...state];

  return (
    <>
      <HeroHeader infoContentHeroHeader={props.serieHeroHeaderData} />

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
        <Waypoint onEnter={fetchAPI} bottomOffset='-800px' />
        {stateLoader && <LoaderInfinite />}
      </section>
    </>
  );
}

export default Tv;

export async function getServerSideProps({ req }) {
  try {
    const apiKey = 'c6a3bad00e21476c3f2e75f7e8893c2d';
    const earlyURL = 'https://api.themoviedb.org/3/';

    // Récupère les films et séries ajouté à ma liste depuis Firebase
    const uid = req.cookies.token;
    const myListData = await getData(uid);

    // Récupère une série via un ID pour le hero header
    const serieHeroHeaderRequest = await fetch(
      `${earlyURL}tv/77169?api_key=${apiKey}&language=fr-FR`
    );
    const serieHeroHeaderData = await serieHeroHeaderRequest.json();

    // Tableau qui accueillera l'ensemble de nos URLS pour effectuer toutes les requêtes
    const URLS = [];
    // Ajoute une URL dans le tableau URLS en incrémentage le numéro de la page
    for (let nPage = 1; nPage <= 6; nPage++) {
      const url = `${earlyURL}discover/tv?api_key=${apiKey}&language=fr-FR&page=${nPage}&with_type=4&with_networks=213&include_null_first_air_dates=false&with_watch_monetization_types=flatrate&with_status=0&sort_by=popularity.desc`;
      URLS.push(url);
    }
    // Requêtes pour récupèrer nos séries
    const tvRequest = await Promise.all([
      fetch(URLS[0]),
      fetch(URLS[1]),
      fetch(URLS[2]),
      fetch(URLS[3]),
      fetch(URLS[4]),
    ]);

    let tvData = await Promise.all([
      tvRequest[0].json(),
      tvRequest[1].json(),
      tvRequest[2].json(),
      tvRequest[3].json(),
      tvRequest[4].json(),
    ]);

    const totalPages = tvData[0].total_pages;

    // Liste de titre pour chaque section
    const titleSection = [
      'Appréciés sur Nasflix',
      'Tendances actuelles',
      'Séries US palpitantes',
      'Pour tous les goûts',
      'Histoire sombre',
    ];

    tvData = tvData.map((tv, index) => {
      return {
        titleSection: titleSection[index],
        content: tv.results.map((elem) => {
          return {
            mediaType: 'tv',
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

    tvData.forEach((dataSection) => {
      dataSection.content = dataSection.content.filter((dataSeries) => {
        return dataSeries.data.backdrop_path;
      });
    });

    return {
      props: {
        serieHeroHeaderData: { mediaType: 'tv', data: serieHeroHeaderData },
        tvData,
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
