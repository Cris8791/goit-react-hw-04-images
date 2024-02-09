import React, { useState, useEffect } from 'react';
import styles from './Modal.module.css';
import Loader from '../Loader/Loader';

const Modal = ({ image, onClose }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const preloadImage = url => {
      const img = new Image();
      img.src = url;
      img.onload = () => setLoading(false);
    };

    preloadImage(image.largeImageURL);
    const handleKeyDown = e => {
      if (e.code === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [image.largeImageURL, onClose]);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal}>
        {loading && <Loader />}
        {!loading && <img src={image.largeImageURL} alt="" />}
      </div>
    </div>
  );
};

export default Modal;
