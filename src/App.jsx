import { useState, useEffect } from 'react';
import { ScaleLoader } from 'react-spinners';
import { Toaster } from 'react-hot-toast';
import axios from 'axios';
import SearchBar from './components/SearchBar/SearchBar';
import LoadMoreBtn from './components/LoadMoreBtn/LoadMoreBtn';
import ImageGallery from './components/ImageGallery/ImageGallery';
import ImageModal from './components/ImageModal/ImageModal';
import './App.css';
import { useDebounce } from 'use-debounce';
import React from 'react';

const ACCESS_KEY = import.meta.env.VITE_ACCESS_KEY;

function App() {
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebounce(query, 300);
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const fetchPhotos = async (searchQuery, pageNumber) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data } = await axios.get(
        'https://api.unsplash.com/search/photos',
        {
          params: {
            query: searchQuery,
            page: pageNumber,
            per_page: 12,
            client_id: ACCESS_KEY,
          },
        }
      );

      setPhotos(prevPhotos =>
        pageNumber === 1 ? data.results : [...prevPhotos, ...data.results]
      );
    } catch (error) {
      if (error.response) {
        setError(
          `Error: ${error.response.status} - ${error.response.data.message}`
        );
      } else {
        setError('Network error. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (debouncedQuery) {
      fetchPhotos(debouncedQuery, 1);
      setPage(1);
    } else {
      setPhotos([]);
    }
  }, [debouncedQuery]);

  const handleLoadMore = async () => {
    const nextPage = page + 1;
    setPage(nextPage);

    await fetchPhotos(debouncedQuery, nextPage);

    setTimeout(() => {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth',
      });
    }, 100);
  };

  const openModal = image => {
    setModalIsOpen(true);
    setSelectedImage(image);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedImage(null);
  };

  return (
    <div>
      <SearchBar onSubmit={setQuery} />
      {error && <p>{error}</p>}
      <Toaster />
      {isLoading && <ScaleLoader />}
      {!isLoading && (
        <>
          {photos.length === 0 && debouncedQuery && (
            <p>
              No results found for "{debouncedQuery}". Please try a different
              search.
            </p>
          )}
          <ImageGallery images={photos} onImageClick={openModal} />
          {photos.length > 0 && <LoadMoreBtn onClick={handleLoadMore} />}
        </>
      )}
      <ImageModal
        isOpen={modalIsOpen}
        onClose={closeModal}
        selectedImage={selectedImage}
      />
    </div>
  );
}

export default App;
