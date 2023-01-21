import React from 'react';
import styles from '/styles/VideoPlayer.module.css';

function VideoPlayer(props) {
  // Puisqu'on ne reçoit que la key de la vidéo on se sert alors d'un iframe proposé par YouTube pour afficher notre vidéo
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
  // Récupère l'ID de l'url (slug) pour utilisation lors du fetch des infos du film ou de la série correspondant à cet ID
  const id = context.params.id;
  // Récupère le mediaType envoyé en paramètre de le l'URL pour faire la bonne requête de type movie ou tv
  const mediaType = context.query.mediaType;

  try {
    const request = await fetch(
      `https://api.themoviedb.org/3/${mediaType}/${id}/videos?api_key=c6a3bad00e21476c3f2e75f7e8893c2d&language=en-US`
    );
    const data = await request.json();
    // On ne garde que les éléments qui respectent l'ensemble des conditions
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
