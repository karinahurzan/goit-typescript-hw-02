import React from 'react';
import Modal from 'react-modal';
import { BsXLg } from 'react-icons/bs';
import styles from './ImageModal.module.css';
import { UnsplashImage } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  selectedImage: UnsplashImage | null;
}

const ImageModal: React.FC<Props> = ({ isOpen, onClose, selectedImage }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className={styles.modal}
      appElement={document.getElementById('root')!}
    >
      <button onClick={onClose} className={styles.closeButton}>
        <BsXLg className={styles.icon} />
      </button>
      {selectedImage && (
        <img
          className={styles.modalImage}
          src={selectedImage.urls.regular}
          alt={selectedImage.alt_description || 'Image'}
        />
      )}
    </Modal>
  );
};

export default ImageModal;
