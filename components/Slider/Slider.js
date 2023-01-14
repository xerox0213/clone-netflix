import styles from './Slider.module.css';
import useSlider from '../../hooks/useSlider';
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi';

function Slider({ children }) {
  const [addElementRef, handleClick, translate] = useSlider();
  return (
    <>
      <div className={styles.sliderContainer}>
        <button
          onClick={() => handleClick('previous')}
          className={styles.btnPrevSlider}
        >
          <BiChevronLeft />
        </button>

        <button
          onClick={() => handleClick('next')}
          className={styles.btnNextSlider}
        >
          <BiChevronRight />
        </button>
        <div ref={addElementRef} className={styles.slider}>
          <div
            ref={addElementRef}
            className={styles.innerSlider}
            style={{
              transform: `translate3d(calc(${translate} * 100%),0px,0px)`,
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </>
  );
}

export default Slider;
