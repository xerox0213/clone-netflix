import Link from 'next/link';
import Image from 'next/image';
import { IoPlay } from 'react-icons/io5';
import styles from './HeroHeader.module.css';

function HeroHeader({ infoContentHeroHeader }) {
  return (
    <div className={styles.heroHeaderContainer}>
      <Image
        src={`https://image.tmdb.org/t/p/original${infoContentHeroHeader.data.backdrop_path}`}
        alt='image'
        priority
        fill
      />

      <div className={styles.heroHeaderContent}>
        <h2 className={styles.heroHeaderTitle}>
          {infoContentHeroHeader.mediaType === 'tv'
            ? infoContentHeroHeader.data.name
            : infoContentHeroHeader.data.title}
        </h2>
        <p className={styles.resumeTextContent}>
          {infoContentHeroHeader.data.overview.slice(0, 150) + '...'}
        </p>
        <div className={styles.heroHeaderBtnsContainer}>
          <Link
            className={styles.playBtnContent}
            href={{
              pathname: `/watch/${infoContentHeroHeader.data.id}`,
              query: { mediaType: infoContentHeroHeader.mediaType },
            }}
          >
            <IoPlay /> Lecture
          </Link>
        </div>
      </div>
    </div>
  );
}

export default HeroHeader;
