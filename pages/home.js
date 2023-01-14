import { useContext } from 'react';
import { useRouter } from 'next/router';
import styles from '/styles/Home.module.css';
import { UserContext } from '../context/UserContext';
import HeroHeader from '../components/HeroHeader/HeroHeader';
import SectionSlider from '../components/SectionSlider/SectionSlider';

function Home(props) {
  const { currentUser } = useContext(UserContext);
  const router = useRouter();

  if (!currentUser) {
    router.push('/signIn');
    return;
  }

  return (
    <>
      <HeroHeader infoContentHeroHeader={props.dataHeroHeader} />
      <section className={styles.sectionCategorySliderContainer}>
        {props.allData.map((infoContentSection, index) => {
          return (
            <SectionSlider
              key={index}
              myListData={props.myListData}
              infoContentSection={infoContentSection}
            />
          );
        })}
      </section>
    </>
  );
}

export default Home;

export async function getServerSideProps({ req }) {
  try {
    const apiKey = 'c6a3bad00e21476c3f2e75f7e8893c2d';
    const earlyURL = 'https://api.themoviedb.org/3/';

    const myListDataRequest = await fetch(
      'https://clone-netflix-lovat-tau.vercel.app/api/database_api/getDataList',
      {
        method: 'GET',
        headers: {
          cookie: req.cookies.token,
        },
      }
    );
    const { myListData } = await myListDataRequest.json();

    const dataHeroHeaderRequest = await fetch(
      `${earlyURL}movie/877269?api_key=${apiKey}&language=fr-FR`
    );

    const dataHeroHeader = await dataHeroHeaderRequest.json();

    const URLS = [
      `${earlyURL}movie/popular?api_key=${apiKey}&language=fr-FR&page=1`,
      `${earlyURL}discover/tv?api_key=${apiKey}&language=fr-FR&page=1&with_type=4&with_networks=213&include_null_first_air_dates=false&with_watch_monetization_types=flatrate&with_status=0&sort_by=popularity.desc`,
      `${earlyURL}discover/tv?api_key=${apiKey}&language=fr-FR&sort_by=popularity.desc&page=1&with_networks=213&include_null_first_air_dates=false&with_watch_monetization_types=flatrate&with_status=0&with_type=0`,
    ];

    const dataRequest = await Promise.all([
      fetch(URLS[0]),
      fetch(URLS[1]),
      fetch(URLS[2]),
    ]);

    let allData = await Promise.all([
      dataRequest[0].json(),
      dataRequest[1].json(),
      dataRequest[2].json(),
    ]);

    const mediaTypes = ['movie', 'tv', 'tv'];
    const titleSection = [
      'Films les plus populaires',
      'Seulement sur Nasflix',
      'Meilleurs documentaires',
    ];

    allData = allData.map((d, index) => {
      return {
        titleSection: titleSection[index],
        content: d.results.map((elem) => {
          return {
            mediaType: mediaTypes[index],
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

    return {
      props: {
        dataHeroHeader: { mediaType: 'movie', data: dataHeroHeader },
        allData,
        myListData,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
}
