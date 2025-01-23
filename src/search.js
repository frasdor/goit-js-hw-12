import axios from 'axios';
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const API_KEY = '46136265-8c05b511bcb8d1129c580e4d3';

const form = document.getElementById('searchForm');
const gallery = document.getElementById('gallery');
const loader = document.querySelector('.loader');
const loadMoreButton = document.querySelector('.loadBtn');

let lightbox;
let currentQuery = '';
let currentPage = 1;
const perPage = 40;

// Funkcja do pobierania obrazów z Pixabay 
async function fetchImages(query, page) {
  const url = `https://pixabay.com/api/?key=${API_KEY}&q=${encodeURIComponent(query)}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}&page=${page}`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: 'Something went wrong while fetching images. Please try again later.',
    });
    return { hits: [], totalHits: 0 };
  }
}

// Funkcja wyświetlająca obrazy w galerii
function displayImages(images) {
  if (images.length === 0 && currentPage === 1) {
    iziToast.error({
      title: 'No Results',
      position: 'topRight',
      message: 'Sorry, there are no images matching your search query. Please try again!',
    });
    return;
  }

  const markup = images.map((image) => `
    <a href="${image.largeImageURL}" class="image-item">
      <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy">
      <div class="info">
        <div class="info-item"><p>Likes</p><p>${image.likes}</p></div>
        <div class="info-item"><p>Views</p><p>${image.views}</p></div>
        <div class="info-item"><p>Comments</p><p>${image.comments}</p></div>
        <div class="info-item"><p>Downloads</p><p>${image.downloads}</p></div>
      </div>
    </a>
  `).join('');

  gallery.insertAdjacentHTML('beforeend', markup);

  // Inicjalizacja lub odświeżenie SimpleLightbox
  if (lightbox) {
    lightbox.refresh();
  } else {
    lightbox = new SimpleLightbox('.image-item', { /* opcjonalne opcje */ });
  }
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();


  const query = document.getElementById('searchQuery').value.trim();
  if (!query) {
    iziToast.warning({
      title: 'Warning',
      position: 'topRight',
      message: 'Please enter a search term.',
    });
    return;
  }

  currentQuery = query;
  currentPage = 1; // Resetowanie numeru strony

  loader.style.display = 'block';
  loadMoreButton.style.display = 'none'; // Ukrycie przycisku "Load more" podczas nowego wyszukiwania

  gallery.innerHTML = ''; // Czyszczenie galerii przed nowym wyszukiwaniem

  const { hits, totalHits } = await fetchImages(currentQuery, currentPage);
  loader.style.display = 'none';

  displayImages(hits);

  if (hits.length > 0 && gallery.children.length < totalHits) {
    loadMoreButton.style.display = 'block'; // Pokaż przycisk "Load more"
  }
});

loadMoreButton.addEventListener('click', async () => {
  currentPage += 1;

  loader.style.display = 'block';
  const { hits, totalHits } = await fetchImages(currentQuery, currentPage);
  loader.style.display = 'none';

  displayImages(hits);

  if (gallery.children.length >= totalHits) {
    loadMoreButton.style.display = 'none'; // Ukryj przycisk "Load more", jeśli to ostatnia strona
    iziToast.info({
      title: 'End of Results',
      message: "We're sorry, but you've reached the end of search results.",
    });
  }

  scrollPage(); // Przewiń stronę po załadowaniu nowych obrazów
});

function scrollPage() {
  const { height: cardHeight } = gallery.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}