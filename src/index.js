import axios from 'axios';
import { Notify } from 'notiflix';
import Simplelightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import './css/styles.css';

const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadMore: document.querySelector('.load-more'),
};

let items = [];
let query = '';
let currentPage = 1;
let currentHits = null;

refs.form.addEventListener('submit', onClickFormSubmit);

async function fetchData() {
  axios.defaults.baseURL = 'https://pixabay.com/api';

  return await axios
    .get('?key=29539692-12de6be8def0b7ebbead6ba62', {
      params: {
        q: query,
        per_page: 40,
        page: currentPage,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
      },
    })
    .then(({ data }) => {
      if (data.totalHits === 0 || query === '') {
        refs.gallery.innerHTML = '';
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        items = data.hits;
        currentHits = data.totalHits;
        Notify.success(`Hooray! We found ${currentHits} images.`);
        currentPage = 1;
        renderGallery();
        slowlyScroll(2);
        lightbox.refresh();
      }
    })

    .catch(error => console.log(error.message));
}

function renderGallery() {
  const markup = items
    .map(
      items =>
        `<div class="photo-card">
        <a class="photo-link" href="${items.largeImageURL}">
      <img class="card__img" src="${items.webformatURL}" alt="${items.tags}" />
      </a>
      <div class="info">
    <p class="info-item"><b>Likes</b>${items.likes}</p>
      <p class="info-item"><b>Views</b>${items.views}</p>
      <p class="info-item"><b>Comments</b>${items.comments}</p>
     <p class="info-item"><b>Downloads</b>${items.downloads}</p>
      </div>
      </div>`
    )
    .join('');
  refs.gallery.insertAdjacentHTML('beforeend', markup);
}

function onClickFormSubmit(e) {
  e.preventDefault();
  query = e.target.elements.searchQuery.value;
  refs.gallery.innerHTML = '';
  console.log(query);
  fetchData();
  refs.loadMore.classList.remove('is-hidden');
  refs.loadMore.style.display = 'flex';
}

refs.loadMore.addEventListener('click', onClickLoadMore);

function onClickLoadMore() {
  currentPage += 1;
  fetchData();
  lightbox.refresh();

  if (currentHits === data.totalHits) {
    refs.loadMore.style.display = 'none';
    Notify.info("We're sorry, but you've reached the end of search results.");
  }
}

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
});
console.log(galleryItems);

function slowlyScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
