import React from 'react';
import { memo } from 'react';
import Box from '../Box/Box';
import Slider from '../Slider/Slider';
import styles from '/styles/Home.module.css';

function SectionSlider({ infoContentSection, myListData }) {
  return (
    <>
      <section className={styles.sectionCategorySlider}>
        <h2 className={styles.titleCategorySlider}>
          {infoContentSection.titleSection}
        </h2>
        <Slider>
          {infoContentSection.content.map((infoContentBox) => {
            return (
              <Box
                myListData={myListData}
                key={infoContentBox.data.id}
                infoContentBox={infoContentBox}
              />
            );
          })}
        </Slider>
      </section>
    </>
  );
}

export default memo(SectionSlider);
