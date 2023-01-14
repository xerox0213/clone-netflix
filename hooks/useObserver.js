import { useState, useRef } from 'react';

function useObserver(totalPages, mediaType) {
  const [stateLoader, setStateLoader] = useState(true);
  const [state, setState] = useState([]);
  const refNPage = useRef(5);

  const fetchAPI = async () => {
    const apiKey = 'c6a3bad00e21476c3f2e75f7e8893c2d';
    const earlyURL = 'https://api.themoviedb.org/3/';
    const allURLS = [];
    let start;
    let end;

    if (refNPage.current < totalPages && refNPage.current + 5 >= totalPages) {
      start = refNPage.current + 1;
      end = refNPage.current + (totalPages - refNPage.current);
      refNPage.current = totalPages;
    } else if (
      refNPage.current < totalPages &&
      refNPage.current + 5 < totalPages
    ) {
      start = refNPage.current + 1;
      end = refNPage.current + 5;
      refNPage.current += 5;
    } else {
      setStateLoader(false);
      return;
    }

    for (let page = start; page <= end; page++) {
      if (mediaType === 'tv') {
        const url = `${earlyURL}discover/tv?api_key=${apiKey}&language=fr-FR&page=${page}&with_type=4&with_networks=213&include_null_first_air_dates=false&with_watch_monetization_types=flatrate&with_status=0&sort_by=popularity.desc`;
        allURLS.push(url);
      } else if (mediaType === 'movie') {
        const url = `${earlyURL}discover/movie?api_key=${apiKey}&language=fr-FR&sort_by=popularity.desc&include_adult=false&include_video=false&page=${page}&year=2021&with_watch_monetization_types=flatrate`;
        allURLS.push(url);
      }
    }

    const dataRequest = await Promise.all([
      fetch(allURLS[0]),
      fetch(allURLS[1]),
      fetch(allURLS[2]),
      fetch(allURLS[3]),
      fetch(allURLS[4]),
    ]);

    let data = await Promise.all([
      dataRequest[0].json(),
      dataRequest[1].json(),
      dataRequest[2].json(),
      dataRequest[3].json(),
      dataRequest[4].json(),
    ]);

    const titleSection = [
      'Appréciés sur Nasflix',
      'Tendances actuelles',
      'Films US palpitantes',
      'Pour tous les goûts',
      'Histoire sombre',
    ];

    data = data.map((d, index) => {
      return {
        titleSection: titleSection[index],
        content: d.results.map((elem) => {
          return {
            mediaType,
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

    data.forEach((dataSection) => {
      dataSection.content = dataSection.content.filter((dataContent) => {
        return dataContent.data.backdrop_path;
      });
    });

    const copyState = [...state, ...data];

    setState(copyState);
  };

  return [state, fetchAPI, stateLoader];
}

export default useObserver;
