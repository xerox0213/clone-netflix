import { useState, useEffect, useRef } from 'react';

function useSlider() {
  const [translate, setTranslate] = useState(0);
  const refSliders = useRef([]);
  const refLock = useRef(false);

  useEffect(() => {
    const innerSlider = refSliders.current[0];
    const lockSlider = (e) => {
      e.target.classList.toggle('isAnimated');
      refLock.current = true;
    };
    const unlockSlider = (e) => {
      e.target.classList.remove('isAnimated');
      refLock.current = false;
    };

    const resizeFunc = (e) => {
      setTranslate(0);
    };

    innerSlider.addEventListener('transitionstart', lockSlider);
    innerSlider.addEventListener('transitionend', unlockSlider);
    window.addEventListener('resize', resizeFunc);

    return () => {
      innerSlider.removeEventListener('transitionstart', lockSlider);
      innerSlider.removeEventListener('transitionend', unlockSlider);
    };
  }, []);

  const handleClick = (action) => {
    if (!refLock.current) {
      const innerSlider = refSliders.current[0];
      const slider = refSliders.current[1];
      const widthSlider = slider.clientWidth;
      const widthInnerSlider = innerSlider.scrollWidth;

      if (action === 'next') {
        const widthCanScroll = widthInnerSlider + (translate - 1) * widthSlider;
        if (widthCanScroll > widthSlider) {
          setTranslate((currentState) => currentState - 1);
        } else if (widthCanScroll <= 0) {
          setTranslate(0);
        } else if (widthCanScroll < widthSlider) {
          const coeff = (widthCanScroll + 2.5) / widthSlider;
          setTranslate((currentState) => currentState - coeff);
        }
      } else if (action === 'previous') {
        let widthCanScroll = translate * widthSlider;
        widthCanScroll = widthCanScroll < 0 ? -widthCanScroll : 0;

        if (widthCanScroll >= widthSlider) {
          setTranslate((currentState) => currentState + 1);
        } else if (widthCanScroll < widthSlider) {
          setTranslate(0);
        }
      }
    } else {
      return;
    }
  };

  const addElementRef = (element) => {
    if (element && !refSliders.current.includes(element)) {
      refSliders.current.push(element);
    }
  };

  return [addElementRef, handleClick, translate];
}

export default useSlider;
