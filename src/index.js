import axios from 'axios';
import { Notify } from 'notiflix';
import Simplelightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import './css/styles.css';

const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
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
    .then(response => { response.data }
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
  currentPage = 1;
  query = e.target.elements.searchQuery.value;
  refs.gallery.innerHTML = '';
  console.log(query);
  fetchData();
  refs.loadMoreBtn.classList.remove('is-hidden');
  refs.loadMoreBtn.style.display = 'flex';
}

refs.loadMoreBtn.addEventListener('click', onClickLoadMore);

function onClickLoadMore() {
  currentPage += 1;
  fetchData();
  lightbox.refresh();

  if (currentHits === data.totalHits) {
    refs.loadMoreBtn.style.display = 'none';
    Notify.info("We're sorry, but you've reached the end of search results.");
  }
}

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
});

function slowlyScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
