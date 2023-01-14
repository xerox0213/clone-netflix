import { useRef } from 'react';
import Image from 'next/image';
import styles from './Box.module.css';
import ModalBox from '../ModalBox/ModalBox';

function Box({ infoContentBox, myListData }) {
  const refBox = useRef();
  const isLocked = useRef(false);

  const url = `https://image.tmdb.org/t/p/w500${infoContentBox.data.backdrop_path}`;

  const handleEnter = () => {
    if (!isLocked.current) {
      const box = refBox.current;
      const modalBox = box.firstElementChild;
      const info = box.getBoundingClientRect();
      const widthWithoutScrollBar = document.body.clientWidth;
      const pixelsLeftSide = +info.left - 2.5;
      const pixelsRightSide = Math.floor(
        widthWithoutScrollBar - +info.right - 2.5
      );
      const widthModalBox = box.clientWidth;
      const widthModalBoxScaled = box.clientWidth * 1.25;
      const widthAddedToModalBox = widthModalBoxScaled - widthModalBox;
      const widthAddedInOneSide = widthAddedToModalBox / 2;
      const style = { scale: 1.25, visibility: 'visible', opacity: 1 };

      const padding = Math.max(10, Math.min(60, (window.innerWidth * 4) / 100));
      if (
        (pixelsLeftSide <= padding && pixelsRightSide <= padding) ||
        (pixelsLeftSide > padding && pixelsRightSide > padding)
      ) {
        style.translate = { x: 0, y: -40 };
      } else if (pixelsLeftSide <= padding) {
        style.translate = { x: widthAddedInOneSide, y: -40 };
      } else if (pixelsRightSide <= padding) {
        style.translate = { x: -widthAddedInOneSide, y: -40 };
      }
      const { translate, scale, visibility, opacity } = style;
      const { x, y } = translate;
      modalBox.style.transform = `translate(${x}px,${y}px) scale(${scale})`;
      modalBox.style.visibility = visibility;
      modalBox.style.opacity = opacity;
    } else {
      return;
    }
  };

  const handleLeave = () => {
    const box = refBox.current;
    const modalBox = box.firstElementChild;
    const style = {
      translate: { x: 0, y: 0 },
      scale: 1,
      visibility: 'hidden',
      opacity: 0,
    };
    const { translate, scale, visibility, opacity } = style;
    const { x, y } = translate;
    modalBox.style.transform = `translate(${x},${y}) scale(${scale})`;
    modalBox.style.visibility = visibility;
    modalBox.style.opacity = opacity;
  };

  return (
    <div
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      ref={refBox}
      className={styles.boxInnerSlider}
    >
      <ModalBox
        myListData={myListData}
        infoContentModalBox={infoContentBox}
        isLocked={isLocked}
      />
      <Image
        className={styles.boxImage}
        src={url}
        width={500}
        height={281}
        alt='poster du film'
        loading='lazy'
      />
    </div>
  );
}

export default Box;
