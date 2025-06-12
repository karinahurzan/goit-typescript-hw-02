import React from 'react';
import styles from './ImageCard.module.css';
import { UnsplashImage } from '../../types';

interface Props {
  image: UnsplashImage;
}

const ImageCard: React.FC<Props> = ({ image }) => {
  return (
    <div className={styles.card}>
      <img src={image.urls.small} alt={image.alt_description ?? 'Image'} />
    </div>
  );
};

export default ImageCard;
