import React from 'react';
import Modal from 'react-modal';
import styles from './ImageModal.module.css';
import { BsXLg } from 'react-icons/bs';

const ImageModal = ({ isOpen, onClose, selectedImage }) => {
  return (
    <Modal 
      isOpen={isOpen} 
      onRequestClose={onClose} 
      className={styles.modal} 
      appElement={document.getElementById('root')} 
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