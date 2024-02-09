import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import Button from './Button/Button';
import Loader from './Loader/Loader';
import Modal from './Modal/Modal';

const API_KEY = '40947481-13c540b45e3fd4f57e1ee7dde';

const App = () => {
  const [query, setQuery] = useState('');
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalImage, setModalImage] = useState('');
  const [totalHits, setTotalHits] = useState(0);

  const fetchImages = useCallback(() => {
    console.log('fetchImages is called');
    const apiUrl = `https://pixabay.com/api/?q=${query}&page=${page}&key=${API_KEY}&image_type=photo&orientation=horizontal&per_page=12`;

    setIsLoading(true);

    axios
      .get(apiUrl)
      .then(response => {
        const newImages = response.data.hits.map(image => ({
          id: image.id,
          webformatURL: image.webformatURL,
          largeImageURL: image.largeImageURL,
        }));
        setImages(prev => [...prev, ...newImages]);
        setPage(prevPage => prevPage + 1);
        setIsLoading(false);
        setTotalHits(response.data.totalHits);
      })
      .catch(error => {
        console.error('Error fetching images:', error);
        setIsLoading(false);
      });
  }, [query, page]); // Includem `query` și `page` ca dependențe

  useEffect(() => {
    if (query) fetchImages();
  }, [query, page, fetchImages]); // Acum `fetchImages` este inclus ca dependență

  const handleSubmit = query => {
    setQuery(query);
    setPage(1);
    setImages([]);
  };

  const handleImageClick = image => {
    setShowModal(true);
    setModalImage(image);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="App">
      <Searchbar onSubmit={handleSubmit} query={query} />
      <ImageGallery images={images} onImageClick={handleImageClick} />
      {isLoading && <Loader />}
      {images.length < totalHits && (
        <Button onLoadMore={() => setPage(prevPage => prevPage + 1)} />
      )}
      {showModal && <Modal image={modalImage} onClose={closeModal} />}
    </div>
  );
};

export default App;
