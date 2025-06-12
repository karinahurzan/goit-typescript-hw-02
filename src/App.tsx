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
import { UnsplashImage } from './types';

const ACCESS_KEY = import.meta.env.VITE_ACCESS_KEY as string;

function App() {
  const [photos, setPhotos] = useState<UnsplashImage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [query, setQuery] = useState<string>('');
  const [debouncedQuery] = useDebounce(query, 300);
  const [selectedImage, setSelectedImage] = useState<UnsplashImage | null>(
    null
  );
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);

  const fetchPhotos = async (
    searchQuery: string,
    pageNumber: number
  ): Promise<void> => {
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

      setPhotos(prev =>
        pageNumber === 1 ? data.results : [...prev, ...data.results]
      );
    } catch (error: any) {
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

  return (
    <div>
      <SearchBar onSubmit={setQuery} />
      {error && <p>{error}</p>}
      <Toaster />
      {isLoading && <ScaleLoader />}
      {!isLoading && (
        <>
          {photos.length === 0 && debouncedQuery && (
            <p>No results found for "{debouncedQuery}".</p>
          )}
          <ImageGallery images={photos} onImageClick={setSelectedImage} />
          {photos.length > 0 && <LoadMoreBtn onClick={handleLoadMore} />}
        </>
      )}
      <ImageModal
        isOpen={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
        selectedImage={selectedImage}
      />
    </div>
  );
}

export default App;
