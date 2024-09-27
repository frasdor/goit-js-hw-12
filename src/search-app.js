// const axios = require('axios/dist/node/axios.cjs'); // node


import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const API_KEY = '46136265-8c05b511bcb8d1129c580e4d3';

const form = document.getElementById('searchForm');
const gallery = document.getElementById('gallery');
const loader = document.querySelector('.loader');

let lightbox;

// Funkcja do pobierania obrazów z Pixabay 
function fetchImages(query) {
  const url = `https://pixabay.com/api/?key=${API_KEY}&q=${encodeURIComponent(query)}&image_type=photo&orientation=horizontal&safesearch=true`;

  return fetch(url)
    .then(response => response.json())
    .then(data => data.hits)
    .catch(error => {
      iziToast.error({
        title: 'Error',
        message: 'Something went wrong while fetching images. Please try again later.',
      });
    });
}

// Funkcja wyświetlająca obrazy w galerii
function displayImages(images) {
  gallery.innerHTML = ''; // Czyszczenie poprzednich wyników

  if (images.length === 0) {
    iziToast.error({
      title: 'No Results',
      position: "topRight",
      message: 'Sorry, there are no images matching your search query. Please try again!',
    });
    return;
  }

  const markup = images.map((image) => {
    return `
      <a href="${image.largeImageURL}" class="image-item">
      <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy">
      <div class="info">
        <div class="info-item">
          <p>Likes</p>
          <p>${image.likes}</p>
        </div>
        <div class="info-item">
          <p>Views</p>
          <p>${image.views}</p>
        </div>
        <div class="info-item">
          <p>Comments</p>
          <p>${image.comments}</p>
        </div>
        <div class="info-item">
          <p>Downloads</p>
          <p>${image.downloads}</p>
        </div>
      </div>
    </a>`;
  }).join('');

  gallery.innerHTML = markup;

  // Inicjalizacja lub odświeżenie SimpleLightbox
  if (lightbox) {
    lightbox.refresh();
  } else {
    lightbox = new SimpleLightbox('.image-item', { /* opcjonalne opcje */ });
  }
}

// Funkcja obsługi wyszukiwania
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const query = document.getElementById('searchQuery').value.trim();
  if (!query) {
    iziToast.warning({
      title: 'Warning',
      position: "topRight",
      message: 'Please enter a search term.',
    });
    return;
  }

  loader.style.display = 'block'; // Pokazanie wskaźnika pobierania
  gallery.innerHTML = ''; // Wyczyść galerię przed nowym wyszukiwaniem

  // Używamy then/catch do obsługi promes
  fetchImages(query)
    .then(images => {
      loader.style.display = 'none'; // Ukrycie wskaźnika pobierania
      if (images) {
        displayImages(images);
      }
    })
    .catch(error => {
      loader.style.display = 'none'; // Ukrycie wskaźnika pobierania w przypadku błędu
      iziToast.error({
        title: 'Error',
        message: 'An error occurred while fetching images. Please try again.',
      });
    });
});
