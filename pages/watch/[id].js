import React from 'react';
import styles from '/styles/VideoPlayer.module.css';

function VideoPlayer(props) {
  return (
    <>
      <div className={styles.videoPlayer}>
        <iframe
          src={`https://www.youtube.com/embed/${props.dataFiltered.key}?controls=1&modestbranding=1&autoplay=1&loop=1&rel=0`}
          title='YouTube video player'
          className={styles.videoPlayer}
          width='100%'
          height='100%'
          frameborder='0'
          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
          allowfullscreen='allowfullscreen'
        ></iframe>
      </div>
    </>
  );
}

export default VideoPlayer;

export async function getServerSideProps(context) {
  const id = context.params.id;
  const mediaType = context.query.mediaType;

  try {
    const request = await fetch(
      `https://api.themoviedb.org/3/${mediaType}/${id}/videos?api_key=c6a3bad00e21476c3f2e75f7e8893c2d&language=en-US`
    );
    const data = await request.json();
    const dataFiltered = data.results.find(
      (elem) =>
        elem.type === 'Trailer' &&
        elem.official === true &&
        elem.site === 'YouTube'
    );

    if (data.status_code === 34 || !dataFiltered) {
      throw 'erreur 404';
    }

    return {
      props: {
        dataFiltered,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
}
